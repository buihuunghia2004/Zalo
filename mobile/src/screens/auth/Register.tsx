
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
// import { authScreenStyle } from '~/styles/screens/authScreenStyle';
// import { registerUser } from '~/features/auth/authService'; 
// import { useAppDispatch } from '../../app/store';

import React from 'react';
// import Button from '~/components/Ui/Button';
import Input from '~/components/Ui/Input-form';
import { Assets } from '~/styles/Ui/assets';
import { colors } from '~/styles/Ui/colors';
import AppButton from '~/components/Ui/Button';
// import CheckBox from '~/components/UI/CheckBox';

const Register: React.FC = () => {
  // const dispatch = useAppDispatch();

  const registerValidationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email_register: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password_register: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'), // Bắt buộc
  });

  return (
    <Formik
      initialValues={{
        username: '',
        email_register: '',
        password_register: '',
      }}
      validationSchema={registerValidationSchema}
      onSubmit={(values) => {  
        const registerCredentials = {  
          username: values.username,  
          email: values.email_register,  
          password: values.password_register,  
        };  
        // dispatch(registerUser(registerCredentials));
      }}  
    >  
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={{flex: 1, backgroundColor: colors.white}}>
          <Text style={{marginTop: 150,textAlign: 'center',marginBottom: 24}}>Create your account</Text>
          <View style={{marginHorizontal: 30, gap: 20}}>
            <Input
              placeholder="E-mail"
              onChangeText={handleChange('email_register')}
              onBlur={handleBlur('email_register')}
              value={values.email_register}
              positionStyle={{}}
              textError={errors.email_register}
              isError={touched.email_register && !!errors.email_register}
            />
            <Input
              isPassword
              placeholder="Password"
              onChangeText={handleChange('password_register')}
              onBlur={handleBlur('password_register')}
              value={values.password_register}
              textError={errors.password_register}
              isError={touched.password_register && !!errors.password_register}
            />
             <Input
              isPassword
              placeholder="Password"
              onChangeText={handleChange('password_register')}
              onBlur={handleBlur('password_register')}
              value={values.password_register}
              textError={errors.password_register}
              isError={touched.password_register && !!errors.password_register}
            />
            <AppButton 
            title='Tạo tài khoản'
             onPress={()=>{console.log('a');
            }}/>      
               
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  inputPositionStyle:{

  }
})

export default Register;
