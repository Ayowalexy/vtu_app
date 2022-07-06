import axios from "axios";
import urls from "./routes";
import AsyncStorage from "@react-native-async-storage/async-storage";


const getToken = async () => {
  const userData = await AsyncStorage.getItem('userData');
  return JSON.parse(userData)?.token;
};


const signUp = async (data) => {
  try {
    const response = await axios.post(
      urls.AUTH.sign_up,
      JSON.stringify(data),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response;
  } catch (error) {
    // handleErrors(error)
    return error.response
  }
}


const login = async (data) => {
  try {
    const response = await axios.post(
      urls.AUTH.login,
      JSON.stringify(data),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const biometricLogin = async (data) => {
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.AUTH.biometric_login,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const getUserProfile = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.PROFILE.user_profile,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const verifyUserEmail = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.VERIFICATION.verify_email,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const verifyOtp = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.AUTH.verify_otp,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const getAllServices = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.SERVICES.get_services,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const getAllPhoneBooks = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.PHONE_BOOK.get_all_phone_books_and_verify,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}




const setPin = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.PIN.set_pin,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const getCables = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.PROVIDERS.get_cables,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const getElectricity = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.PROVIDERS.get_electricity,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const getStartimes = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.PROVIDERS.get_startimes,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}





const verifyMultiChoice = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.VERIFY.verify_multichoice,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}





const verifyStarTimes = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.VERIFY.verify_startTimes,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const verifyMeter = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.VERIFY.verify_meter,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const getSettings = async () => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.RATE.setting,
      JSON.stringify({ id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}




const getSystemBanks = async () => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.BANKS.get_banks,
      JSON.stringify({ id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}







const resetPassword = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.RESET.reset_password,
      JSON.stringify({ ...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}




const resetProfile = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.RESET.reset_profile,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const getHistory = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.HISTORY.get_history,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const fundUser = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.FUND.fund_user,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const getDataAndVerify = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.SERVICES.get_data_and_verify,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const getAllAds = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.AD.get_all_ads,
      JSON.stringify({id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}




const fundAirtimeAndData = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.RECHARGE.fund_data_and_airtime,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const addPaymentProof = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;
  try {
    const response = await axios.post(
      urls.BANKS.payment_proof,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const getAllFAQsAndFetchOne = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;

  console.log({...data, id})
  try {
    const response = await axios.post(
      urls.SUPPORT.get_all_frequent_questions,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}




const verifyAndTransfer = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;

  console.log({...data, id})
  try {
    const response = await axios.post(
      urls.TRANSFER.verify_account_tranfser,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const createNewTickets = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;

  console.log({...data, id})
  try {
    const response = await axios.post(
      urls.SUPPORT.create_new_tickets,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const topupElectricity = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;

  console.log({...data, id})
  try {
    const response = await axios.post(
      urls.FUND.pay_electricity,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}




const topupCable = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;

  console.log({...data, id})
  try {
    const response = await axios.post(
      urls.FUND.pay_cable,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const notifications = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;

  console.log({...data, id})
  try {
    const response = await axios.post(
      urls.NOTIFICATION.get_all_notifications,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const verifyStartimes = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;

  console.log({...data, id})
  try {
    const response = await axios.post(
      urls.VERIFY.verify_star_times,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}



const listOfBanks = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;

  console.log({...data, id})
  try {
    const response = await axios.post(
      urls.BANKS.list_of_banks,
      JSON.stringify({...data, id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}


const appRelease = async (data) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userData');
  const id = JSON.parse(userId)?.id;

  console.log({...data, id})
  try {
    const response = await axios.post(
      urls.VERSION.check_version,
      JSON.stringify({id}),
      {
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      },
    );
    return response;
  } catch (error) {
    return error.response
  }
}









const getAllBanks =  async () => {
  const url = 'https://api.okra.ng/v2/banks/list'
  try {
      const response = await axios.get(url, {
          headers: {
              "Content-Type": "applicaton/json"
          }
      })
      return response
  } catch(e){
      return e
  }
}





export {
  signUp,
  login,
  getUserProfile,
  verifyUserEmail,
  getAllServices,
  getAllPhoneBooks,
  setPin,
  verifyOtp,
  getCables,
  verifyMultiChoice,
  verifyStarTimes,
  getElectricity,
  verifyMeter,
  getSettings,
  getSystemBanks,
  resetPassword,
  resetProfile,
  getHistory,
  fundUser,
  getStartimes,
  getDataAndVerify,
  getAllAds,
  fundAirtimeAndData,
  addPaymentProof,
  getAllFAQsAndFetchOne,
  verifyAndTransfer,
  getAllBanks,
  createNewTickets,
  biometricLogin,
  topupElectricity,
  topupCable,
  notifications,
  verifyStartimes,
  listOfBanks,
  appRelease
}