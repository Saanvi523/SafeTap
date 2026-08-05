

export default function Sign_up ({ navigation }: any) {
  const [fullName, setFullName] = useState ("");
  const [email,setEmail] = useState ("");
  const [phone, setPhone] = useState ("");
  const [password,setPassword] = useState ("")
  const [confirmPassword, setConfirmPassword] = useState ("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState (false);

  return ()