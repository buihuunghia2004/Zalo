import {useCallback, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {_MessageSentRes} from '~/features/message/dto/message.dto.parent';
import {MessageService} from '~/features/message/messageService';
import {useSelector} from 'react-redux';
import {appSelector} from '~/features/app/appSlice';
import {PageOptionsDto} from '~/features/common/pagination/paginationDto';
import {syncMessagesToDB} from '~/database/synchronous/MessageSync';
import MessageRepository from '~/database/repositories/MessageRepository';

export const useSyncedMessages = () => {
  const [messages, setMessages] = useState<_MessageSentRes[]>([]);
  const [pagination, setPagination] = useState<PageOptionsDto>({});
  const [loading, setLoading] = useState(false);
  const {currentRoomId} = useSelector(appSelector);

  const syncMessages = useCallback(async () => {
    const {type, isConnected} = await NetInfo.fetch();
    if (type === 'wifi' && isConnected) {
      const apiMessages = await MessageService.loadMoreMessage({
        data: currentRoomId ?? '',
        pagination,
      });
      if (apiMessages) {
        setPagination(apiMessages.pagination);
        await syncMessagesToDB(apiMessages.data);
      }
    }
    setMessages(
      await MessageRepository.getMessagesByRoomId(currentRoomId ?? ''),
    );
  }, []);

  useEffect(() => {
    syncMessages();

    const unsubscribeNet = NetInfo.addEventListener(({type, isConnected}) =>
      type === 'wifi' && isConnected
        ? syncMessages()
        : MessageRepository.getMessagesByRoomId(currentRoomId ?? '').then(
            setMessages,
          ),
    );

    return () => {
      unsubscribeNet();
    };
  }, [syncMessages]);

  return {messages, setMessages};
};
