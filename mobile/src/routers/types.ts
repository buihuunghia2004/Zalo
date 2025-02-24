import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BaseProfilePagram, ProfilePersonalPagram } from "./main/mainPagramTypes";
import { Relation } from "~/features/relation/dto/relation.dto.nested";

export type MainStackParamList = {
  Main: {newFriend: Relation};
  SearchScreen: undefined;
  ChatScreen: undefined
  AddFriendScreen: undefined;
  ProfilePersonalScreen: { profile: ProfilePersonalPagram }
  SenAddFriendScreen: {baseProfile: BaseProfilePagram}
  OptionalFriendScreen: {baseProfile: BaseProfilePagram}
  HandleReqScreen: undefined
};
export const StackNames = {
  Main: 'Main',
  SearchScreen: 'SearchScreen',
  ChatScreen: 'ChatScreen',
  AddFriendScreen: 'AddFriendScreen',
  ProfilePersonalScreen: 'ProfilePersonalScreen',
  SenAddFriendScreen: 'SenAddFriendScreen',
  HandleReqScreen: 'HandleReqScreen',
  OptionalFriendScreen: 'OptionalFriendScreen'
} as const;

export type MainNavProp = NativeStackNavigationProp<MainStackParamList, 'Main'>;


export type TabParamList = {
  HomeTab: undefined;
  ContactsTab: undefined;
  DiaryTab: undefined;
  PersonalTab: undefined;
};

