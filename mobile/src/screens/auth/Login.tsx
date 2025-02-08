import { Text, TouchableOpacity, View} from 'react-native';  
import React from 'react';  
import * as Yup from 'yup';  
import { Formik } from 'formik';  
import AppInput from '~/components/Ui/Input-form';  
import { LoginScreenStyles } from '~/styles/screens/LoginScreenStyles';  
import { Assets } from '~/styles/Ui/assets';  
import { viewStyle } from '~/styles/Ui/views';  
import AppButton from '~/components/Ui/Button';  
import { colors } from '~/styles/Ui/colors';  
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuthDispatch } from '~/stores/redux/store';
import { loginWithGoogle } from '~/features/auth/authService';
import { loginGoogleRequest } from '~/features/auth/authDto';

GoogleSignin.configure({
  webClientId:'813157104392-t3rru3rluegqftrtov6sp82momi4s494.apps.googleusercontent.com'
})

const loginValidationSchema = Yup.object().shape({  
  email_login: Yup.string()  
    .email('Invalid email address')  
    .required('Email is required'),  
  password_login: Yup.string()  
    .min(6, 'Password must be at least 6 characters')  
    .required('Password is required'),  
});  

const LoginForm: React.FC = () => {  

  const dispatch = useAuthDispatch();
  const handleLoginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      
      if (userInfo.data?.idToken) {
        const googleRequest: loginGoogleRequest = {idToken: userInfo.data.idToken,};

        dispatch(loginWithGoogle(googleRequest));
      } else {
        console.error('Google Sign-In failed: Missing idToken.');
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };
  return (  
    <Formik  
      initialValues={{ email_login: '', password_login: '' }}  
      validationSchema={loginValidationSchema}  
      onSubmit={(values) => {  
        const loginCredentials = {  
          email: values.email_login,  
          password: values.password_login,  
        }  
        // dispatch(loginUser(loginCredentials));  
      }}>  
      {({  
        handleChange,  
        handleBlur,  
        handleSubmit,  
        values,  
        errors,  
        touched,  
      }) => (  
        <View style={{ flex: 1, backgroundColor: colors.white}}>  
          <View style={{marginTop: 200, paddingHorizontal: 30, gap: 10}}>  
            <Text style={LoginScreenStyles.title}>Zalo</Text>  
            <AppInput  
              placeholder="E-mail"  
              onChangeText={handleChange('email_login')}  
              onBlur={handleBlur('email_login')}  
              value={values.email_login}  
              positionStyle={LoginScreenStyles.inputPositionStyle}  
              textError={errors.email_login}  
              isError={touched.email_login && !!errors.email_login}  
            />  
            <AppInput  
              isPassword  
              placeholder="Password"  
              onChangeText={handleChange('password_login')}  
              onBlur={handleBlur('password_login')}  
              value={values.password_login}  
              textError={errors.password_login}  
              isError={touched.password_login && !!errors.password_login}  
            />  
            <AppButton  
              title="Đăng nhập"  
              onPress={handleSubmit}  
            />  
             <View style={[viewStyle.container_row_between, { gap: 16 }]}>  
              <AppButton  
                leftIcon={Assets.icons.google}  
                outline  
                onPress={handleLoginWithGoogle}  
                title="Google"  
                style={{ flex: 1 }}  
              />  
             
            </View> 
            <View style={LoginScreenStyles.checkBoxContainer}>  
              <Text>I agree to all</Text>  
              <TouchableOpacity>  
                <Text style={LoginScreenStyles.linkText}>  
                  Terms & Conditions  
                </Text>  
              </TouchableOpacity>  
            </View>  

            
            <View style={[viewStyle.center, { flexDirection: 'row' }]}>  
              <Text>Already have an account?</Text>  
              <TouchableOpacity>  
                <Text style={LoginScreenStyles.linkTextFooter}>Sign in</Text>  
              </TouchableOpacity>  
            </View>  
          </View>  
        </View>  
      )}  
    </Formik>  
  );  
};  

export default LoginForm