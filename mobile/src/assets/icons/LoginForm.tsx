import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AppButton from '~/components/UI/Button'
import { containerStyles, globalStyles } from '~/styles/globalStyles'
import * as Yup from 'yup';
import {Formik} from 'formik';
import AppInput from '~/components/UI/Input-form';
import { assets } from '~/styles/assets';
import CheckBox from '~/components/UI/CheckBox';
import { authScreenStyle } from '~/styles/screens/authScreenStyle';

import { loginUser } from '~/features/auth/authService'; 
import { useAppDispatch } from '../../app/store';

const loginValidationSchema = Yup.object().shape({
    email_login: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password_login: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });
const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  return (
    <Formik
      initialValues={{
        email_login: '',
        password_login: '',
      }}
      validationSchema={loginValidationSchema}
      onSubmit={(values) => {  
        const loginCredentials = {  
          email: values.email_login,  
          password: values.password_login,  
        };  
        dispatch(loginUser(loginCredentials));
      }} 
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        resetForm,
      }) => (
        <View>
          <Text style={authScreenStyle.textTitle}>Create your account</Text>
          <View style={authScreenStyle.inputContainer}>
            <AppInput
              placeholder="E-mail"
              onChangeText={handleChange('email_login')}
              onBlur={handleBlur('email_login')}
              value={values.email_login}
              leftIcon={assets.icon.sms}
              positionStyle={authScreenStyle.inputPositionStyle}
              textError={errors.email_login}
              isError={touched.email_login && !!errors.email_login}
            />
            <AppInput
              placeholder="Password"
              onChangeText={handleChange('password_login')}
              onBlur={handleBlur('password_login')}
              value={values.password_login}
              leftIcon={assets.icon.key}
              textError={errors.password_login}
              isError={touched.password_login&& !!errors.password_login}
            />
          </View>
          <View style={authScreenStyle.checkBoxContainer}>
            <CheckBox />
            <Text>I agree to all</Text>
            <TouchableOpacity>
              <Text style={authScreenStyle.linkText}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
          <AppButton title="Create Account" onPress={handleSubmit} />
          <View style={authScreenStyle.lineContainer}>
            <View style={globalStyles.line} />
            <Text style={{textAlign: 'center', marginHorizontal: 8}}>
              Or Sign Up with
            </Text>
            <View style={globalStyles.line} />
          </View>
          <View style={[containerStyles.containerBetween, {gap: 16}]}>
            <AppButton
              leftIcon={assets.icon.facebook}
              outline
              onPress={() => console.log()}
              title="Facebook"
              positionStyle={{flex: 1}}
            />
            <AppButton
              leftIcon={assets.icon.google}
              onPress={() => console.log()}
              outline
              title="Google"
              positionStyle={{flex: 1, marginBottom: 24}}
            />
          </View>
          <View
            style={[
              containerStyles.containerCenter,
              {flexDirection: 'row'},
            ]}>
            <Text>Already have an account?</Text>
            <TouchableOpacity>
              <Text style={authScreenStyle.linkTextFooter}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  )
}
export default LoginForm
