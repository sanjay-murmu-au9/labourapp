export type UserProfile = {
  name: string;
  phoneNumber: string;
  occupation: string;
  location?: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
};

export type ChatUser = {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
};

export type RootStackParamList = {
  PhoneLogin: undefined;
  OTPVerification: { phoneNumber: string };
  UserName: { phoneNumber: string };
  Occupation: { name: string; phoneNumber: string };
  Location: { userProfile: UserProfile };
  UserDetails: { userProfile: UserProfile };
  Jobs: { userProfile: UserProfile };
  JobsProvider: { userProfile: UserProfile };
  ChatList: { userProfile: UserProfile };
  Chat: { user: ChatUser };
};