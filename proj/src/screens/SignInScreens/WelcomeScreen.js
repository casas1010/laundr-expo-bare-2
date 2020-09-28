import React, { useState, useRef, useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  AsyncStorage,
} from "react-native";
// import jwtDecode from "jwt-decode";
// import { MaterialIcons } from "@expo/vector-icons";
// import { FontAwesome5 } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GlobalStyles from "../../components/GlobalStyles";
import Container from "../../components/Container";
import MenuModal from "../../components/MenuModal";
// import { AppLoading } from "expo";
import axios from "axios";

import _ from "lodash";
import { connect } from "react-redux";

import * as actions from "../../actions/index";

import {
  HEIGHT,
  FIELD_NAME_FONT_SIZE,
  FIELD_VALUE_FONT_SIZE,
  WIDTH,
  BUTTON,
  INPUT_TITLE,
  FIELD_VALUE_CONTAINER,
  BUTTON_TEXT,
  BUTTON_CONTAINER,
} from "../../components/Items/";

import { USERTYPES } from "../../components/Data/";

// NOTES
// not sure how to add font Calmer Bold

const WelcomeScreen = (props) => {
  const [email, setEmail] = useState("jcasasmail@gmail.com");
  const [password, setPassword] = useState("yCxGRcgJ7C9JdY2");
  const [userType, setUserType] = useState("User");
  const [userModalView, setUserModalView] = useState(false);

  // REDUX LOGIN FLOW
  const loginWithEmail = async () => {
    // props.facebookLogin();
    props.emailLogin({email,password});
    onAuthComplete(props);
  };

  //   // snippet of code should resemble componentWillReceiveProps
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    onAuthComplete(props);
  }, [props.token]);
  //   // snippet of code should resemble componentWillReceiveProps

  const onAuthComplete = (props) => {
    if (props.token) {
      props.navigation.navigate("drawer");
    }
  };
  // REDUX LOGIN FLOW

  //  MODAL VARIABLE
  const setUserHelper = (item) => {
    setUserType(item);
    showModalUser();
  };
  const showModalUser = () => {
    console.log("showModalUser()");
    setUserModalView(!userModalView);
  };
  const modalButtonHelper = () => {
    showModalUser();
  };
  //  MODAL VARIABLE

  // ANIMATION
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1900,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    fadeIn();
  }, []);
  // ANIMATION

  // LOG IN FLOW
  const handleLogin = async (event) => {
    // console.log(`login initiated with the following:`);
    // console.log(`email: ${email}`);
    // console.log(`password: ${password}`);
    // console.log(`userType: ${userType}`);

    // this.handleInputValidation()
    if (true) {
      try {
        const response = await axios.post("/api/user/login", {
          email: email.toLowerCase(),
          password: password,
        });

        if (response.data.success) {
          const token = response.data.token;
          await AsyncStorage.setItem("email_token", token);

          localStorage.setItem("email_token", token);

          const data = jwtDecode(token);

          setIsWasher(data.isWasher);
          setIsDriver(data.isDriver);
          setIsAdmin(data.isAdmin);
        } else {
          // this.context.showAlert(response.data.message);
          console.log("else:(");
        }
      } catch (error) {
        // showConsoleError("logging in", error);
        // this.context.showAlert(caughtError("logging in", error, 99));
        console.log("error!");
      }
    }
  };
  // LOG IN FLOW

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logo}>
          <Image
            style={{ height: HEIGHT * 0.15, width: WIDTH * 0.85 }}
            resizeMode="contain"
            source={require("../../assets/Launch_Logo.png")}
          />
        </View>
        <Animated.View
          style={{
            opacity: fadeAnim,
            alignItems: "center",
          }}
        >
          <Text style={styles.animatedText}>Explore More. Stress Less</Text>
        </Animated.View>

        <Container>
          <TouchableOpacity
            onPress={modalButtonHelper}
            style={[FIELD_VALUE_CONTAINER, { width: 65, marginBottom: 5 }]}
          >
            <Text>{userType}</Text>
          </TouchableOpacity>
          <MenuModal
            title="Select User Type"
            setCardTypeHelper={setUserHelper}
            showModal={showModalUser}
            modalView={userModalView}
            data={USERTYPES}
          />

          <View style={[styles.container_Email_Password, { marginBottom: 5 }]}>
            {/* <MaterialIcons
              name="person"
              size={24}
              color="black"
              style={[styles.icon, { paddingTop: 3 }]}
            /> */}
            <TextInput
              value={email}
              onChangeText={(email) => setEmail(email)}
              placeholder=" Email"
              style={[FIELD_VALUE_CONTAINER, { width: "80%" }]}
            />
          </View>

          <View style={styles.container_Email_Password}>
            {/* <FontAwesome5
              name="unlock-alt"
              size={18}
              color="black"
              style={[styles.icon, { paddingLeft: 4, paddingTop: 5 }]}
            /> */}
            <TextInput
              value={password}
              onChangeText={(password) => setPassword(password)}
              secureTextEntry={true}
              placeholder=" Password"
              style={[FIELD_VALUE_CONTAINER, { width: "80%" }]}
            />
          </View>
        </Container>
        <View style={styles.buttonsContainer}>
          <BUTTON onPress={loginWithEmail} text="LOG IN" />
          <BUTTON
            onPress={() => props.navigation.navigate("signUpDetails")}
            text="SIGN UP"
          />

          <TouchableOpacity
            onPress={() => props.navigation.navigate("forgotPassword")}
          >
            <Text style={[BUTTON_TEXT, { color: "black" }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 10,
    alignItems: "center",
  },
  animatedText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    // fontFamily:'Calmer Bold'
  },
  container_Email_Password: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    height: 30,
    width: 30,
    // backgroundColor: "red",
  },
  buttonsContainer: {
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#01c9e2",
    margin: 10,
    // height: 20,
    width: 250,
    borderRadius: 10,
  },
  buttonText: {
    padding: 10,
    fontSize: 15,
  },
});


function mapStateToProps({ auth }) {
  return { token: auth.token };
}

export default connect(mapStateToProps, actions)(WelcomeScreen);
