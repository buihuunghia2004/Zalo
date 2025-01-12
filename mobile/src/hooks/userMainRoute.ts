import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from '~/routers/types';

export function useTypedRoute<T extends keyof MainStackParamList>() {
  return useRoute<RouteProp<MainStackParamList, T>>();
}
