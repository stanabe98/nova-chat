import axios from "axios";

export const deleteUserNotifications = async (userId, chats) => {
  
  try {
    await axios.delete(`api/user/notifications/${userId}`, {
      data: { chatIds: [chats] }, // Pass chatIds as an object with key 'chatIds'
    });
  } catch (error) {
    console.log(error);
  }
};
