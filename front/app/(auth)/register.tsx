import { useRegisterMutation } from "@/hooks/useAuth";
import { ErrorResponse } from "@/utils/error-response";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<ErrorResponse | null>(null);
  const { mutate: register, isPending } = useRegisterMutation();

  const validateEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.trim());
  };
  const validateUsername = (value: string) => {
    const v = value.trim();
    return v.length >= 3 && v.length <= 30;
  };
  const validatePassword = (value: string) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return re.test(value);
  };
  const validatePhone = (value: string) => {
    const re = /^0[3-9]\d{8}$/;
    return re.test(value.trim());
  };

  const parseApiErrors = (errorString: string) => {
    const errors: Record<string, string[]> = {};
    if (!errorString) return errors;

    const errorParts = errorString.split(",").map((part) => part.trim());
    
    errorParts.forEach((part) => {
      const colonIndex = part.indexOf(":");
      if (colonIndex > 0) {
        const field = part.substring(0, colonIndex).trim();
        const message = part.substring(colonIndex + 1).trim();
        if (field && message) {
          let normalizedField = field;
          if (field.toLowerCase() === "phonenumber") {
            normalizedField = "phoneNumber";
          } else if (field.toLowerCase() === "email") {
            normalizedField = "email";
          } else if (field.toLowerCase() === "username") {
            normalizedField = "username";
          } else if (field.toLowerCase() === "password") {
            normalizedField = "password";
          }
          
          if (!errors[normalizedField]) {
            errors[normalizedField] = [];
          }
          errors[normalizedField].push(message);
        }
      } else {
        const lowerPart = part.toLowerCase();
        if (lowerPart.includes("email")) {
          const message = part;
          if (!errors.email) {
            errors.email = [];
          }
          errors.email.push(message);
        } else if (lowerPart.includes("phone") || lowerPart.includes("số điện thoại")) {
          const message = part;
          if (!errors.phoneNumber) {
            errors.phoneNumber = [];
          }
          errors.phoneNumber.push(message);
        } else if (lowerPart.includes("username") || lowerPart.includes("tên người dùng")) {
          const message = part;
          if (!errors.username) {
            errors.username = [];
          }
          errors.username.push(message);
        } else if (lowerPart.includes("password") || lowerPart.includes("mật khẩu")) {
          const message = part;
          if (!errors.password) {
            errors.password = [];
          }
          errors.password.push(message);
        }
      }
    });
    return errors;
  };

  React.useEffect(() => {
    if (
      apiError &&
      apiError.status === 400 &&
      typeof apiError.error === "string"
    ) {
      const parsedErrors = parseApiErrors(apiError.error);

      if (parsedErrors.email && parsedErrors.email.length > 0) {
        setEmailError(parsedErrors.email[0]);
      }

      if (parsedErrors.password && parsedErrors.password.length > 0) {
        setPasswordError(parsedErrors.password[0]);
      }

      if (parsedErrors.username && parsedErrors.username.length > 0) {
        setUsernameError(parsedErrors.username[0]);
      }

      if (parsedErrors.phoneNumber && parsedErrors.phoneNumber.length > 0) {
        setPhoneError(parsedErrors.phoneNumber[0]);
      }
    }
  }, [apiError]);

  const isFormValid =
    validateEmail(email) &&
    validateUsername(username) &&
    validatePassword(password) &&
    validatePhone(phoneNumber);

  const handleRegister = () => {
    setEmailError(validateEmail(email) ? null : "Email không hợp lệ");
    const u = username.trim();
    if (!u) {
      setUsernameError("Tên người dùng không được để trống");
    } else if (!validateUsername(u)) {
      setUsernameError("Tên người dùng phải có độ dài từ 3 đến 30 ký tự");
    } else {
      setUsernameError(null);
    }
    setPasswordError(
      validatePassword(password)
        ? null
        : "Mật khẩu phải chứa ít nhất 1 chữ cái, 1 số, 1 ký tự đặc biệt và tối thiểu 8 ký tự"
    );
    const pn = phoneNumber.trim();
    if (!pn) {
      setPhoneError("Số điện thoại không được để trống");
    } else {
      setPhoneError(validatePhone(pn) ? null : "Số điện thoại không hợp lệ");
    }
    if (!isFormValid) return;
    setApiError(null);
    register(
      {
        email,
        password,
        ...(fullname.trim().length > 0 && { fullName: fullname }),
        username,
        phoneNumber,
      },
      {
        onError: (err: any) => {
          if (
            err &&
            typeof err === "object" &&
            "error" in err &&
            "status" in err
          ) {
            setApiError(err as ErrorResponse);
          }
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Instagram</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          if (emailError) setEmailError(null);
        }}
        onBlur={() =>
          setEmailError(validateEmail(email) ? null : "Email không hợp lệ")
        }
      />
      {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={(v) => {
          setUsername(v);
          if (usernameError) setUsernameError(null);
        }}
        onBlur={() =>
          setUsernameError(() => {
            const u = username.trim();
            if (!u) return "Tên người dùng không được để trống";
            if (!validateUsername(u))
              return "Tên người dùng phải có độ dài từ 3 đến 30 ký tự";
            return null;
          })
        }
      />
      {!!usernameError && <Text style={styles.errorText}>{usernameError}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="#999"
        value={fullname}
        onChangeText={setFullname}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={(v) => {
          setPhoneNumber(v);
          if (phoneError) setPhoneError(null);
        }}
        onBlur={() =>
          setPhoneError(() => {
            const pn = phoneNumber.trim();
            if (!pn) return "Số điện thoại không được để trống";
            return validatePhone(pn) ? null : "Số điện thoại không hợp lệ";
          })
        }
      />
      {!!phoneError && <Text style={styles.errorText}>{phoneError}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          if (passwordError) setPasswordError(null);
        }}
        onBlur={() =>
          setPasswordError(
            validatePassword(password)
              ? null
              : "Mật khẩu phải chứa ít nhất 1 chữ cái, 1 số, 1 ký tự đặc biệt và tối thiểu 8 ký tự"
          )
        }
      />
      {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

      <TouchableOpacity
        style={[
          styles.signUpButton,
          (!isFormValid || isPending) && styles.signUpButtonDisabled,
        ]}
        onPress={handleRegister}
        disabled={!isFormValid || isPending}
      >
        <Text style={styles.signUpText}>
          {isPending ? "Signing up..." : "Sign up"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.loginLink}>Log in.</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bottomText}>Instagram or Facebook</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    fontSize: 42,
    fontFamily: "Billabong",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fafafa",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: "#3797EF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  signUpButtonDisabled: {
    backgroundColor: "#B2DFFC",
    opacity: 0.6,
  },
  signUpText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  facebookButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  facebookText: {
    color: "#3797EF",
    fontWeight: "600",
    fontSize: 15,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    marginHorizontal: 10,
    color: "#999",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    marginBottom: 60,
  },
  footerText: {
    color: "#999",
  },
  loginLink: {
    color: "#000",
    fontWeight: "600",
  },
  bottomText: {
    position: "absolute",
    bottom: 20,
    color: "#999",
    fontSize: 12,
  },
  errorText: {
    width: "100%",
    color: "#e74c3c",
    fontSize: 12,
    marginTop: -6,
    marginBottom: 8,
  },
});
