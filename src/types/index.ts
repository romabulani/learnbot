export type Session = {
  session_id: string;
  session_name?: string;
  username: string;
};

export type Message = {
  sender: string;
  message: string;
};
