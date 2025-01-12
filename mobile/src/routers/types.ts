import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfilePersonalPagram, SenAddFriendPagram } from "./main/mainPagramTypes";


export type MainStackParamList = {
  Main: undefined;
  SearchScreen: undefined;
  ChatScreen: { id: string };
  AddFriendScreen: undefined;
  ProfilePersonalScreen: { profile: ProfilePersonalPagram }
  SenAddFriendScreen: {baseProfile: SenAddFriendPagram}
};
export const StackNames = {
  Main: 'Main',
  SearchScreen: 'SearchScreen',
  ChatScreen: 'ChatScreen',
  AddFriendScreen: 'AddFriendScreen',
  ProfilePersonalScreen: 'ProfilePersonalScreen',
  SenAddFriendScreen: 'SenAddFriendScreen',
} as const;

export type MainNavProp = NativeStackNavigationProp<MainStackParamList, 'Main'>;


export type TabParamList = {
  HomeTab: undefined;
  ContactsTab: undefined;
  DiaryTab: undefined;
  PersonalTab: undefined;
};

