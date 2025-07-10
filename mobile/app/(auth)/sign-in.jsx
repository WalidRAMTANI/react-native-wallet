import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'

import { styles } from "@/assets/styles/auth.styles.js"
import { COLORS } from "@/constants/colors.js";
import { Ionicons } from '@expo/vector-icons';
import { Image} from "expo-image";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default function SignUpScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState("");
  
  // Handle submission of sign-up form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if(err.errors?.[0]?.code == "form_password_incorrect") {
        setError("Password is incorrect, please try again.");
      }else{
        setError("An error occurred during sign-in. Please try again later.");
      }      
    }
    }
  return (
    <KeyboardAwareScrollView styles={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          enableAutomaticScroll={true}>
      <View style={styles.container}>
        <Image
            source={require('@/assets/images/revenue-i4.png')}
            style={styles.illustration}
            contentFit="contain"
            />
        <Text style={styles.title}> Welcome Back</Text>
        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={24} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name="close" size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          autoCapitalize="none"
          style={[styles.input, error && styles.errorInput]}
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
        
          value={password}
          style={[styles.input, error && styles.errorInput]}

          placeholder="Enter password"
          secureTextEntry={true}
          placeholderTextColor="#9A8478"
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignInPress} style={styles.button}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}