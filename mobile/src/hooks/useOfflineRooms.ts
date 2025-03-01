import {useCallback, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {RoomService} from '~/features/room/roomService'; // Giả định service API cho rooms
import {syncRoomsFromAPi} from '~/database/synchronous/RoomSync'; // Giả định hàm đồng bộ rooms
import RoomRepository from '~/database/repositories/RoomRepository'; // Giả định repository cho rooms
import {RoomItemView} from '~/database/dto/room.dto';

// Interface cho Room (tùy chỉnh theo DTO của bạn)

export const useOfflineRooms = () => {
  const [rooms, setRooms] = useState<RoomItemView[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLocalRooms = async () => {
    try {
      const localRooms = await RoomRepository.getAllRooms();
      // setRooms(localRooms);
    } catch (error) {
      console.error('Failed to load local rooms:', error);
    }
  };

  // const syncRoomsFromServer = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const rooms = await RoomService.getAllRooms();
  //     await syncRoomsFromAPi(rooms);
  //     await loadLocalRooms();
  //   } catch (error) {
  //     console.error('Error syncing rooms from server:', error);
  //     await loadLocalRooms();
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [loadLocalRooms]);

  useEffect(() => {
    const unsubscribeNet = NetInfo.addEventListener(({type, isConnected}) => {
      console.log('NetInfo event:', {type, isConnected});
      if (type === 'wifi' && isConnected) {
        // syncRoomsFromServer().catch((err) => console.error('Sync failed:', err));
      } else {
        // loadLocalRooms().catch((err) => console.error('Load local failed:', err));
      }
    });

    return () => {
      console.log('useOfflineRooms unmounted');
      unsubscribeNet();
    };
  }, []);

  return {rooms, setRooms, loading};
};
