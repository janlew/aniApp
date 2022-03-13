import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { auth } from "../../../app/firebase";
import { setUserLoginDetails } from "../userSlice";

import Container from "../../ui/Container";
import Button from "../../ui/Button";
import Form from "../../form/Form";
import Input from "../../form/components/Input";

const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const formSchema = Yup.object().shape({
		email: Yup.string().required("Email is required"),
		password: Yup.string()
			.required("Password is required")
			.min(6, "Password must be at least 6 characters long"),
		password_confirm: Yup.string()
			.required("Confirm password")
			.oneOf([Yup.ref("password")], "Passwords does not match"),
	});

	const submitHandler = (data) => {
		createUserWithEmailAndPassword(auth, data.email, data.password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;

				dispatch(
					setUserLoginDetails({
						email: user.email,
					})
				);

				navigate("/");
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ..
			});
	};

	return (
		<Container>
			<Wrap>
				<Form
					defaultValues={{
						email: "",
						password: "",
						password_confirm: "",
					}}
					resolver={yupResolver(formSchema)}
					onSubmit={submitHandler}
				>
					<Input name="email" placeholder="Email" type="email" />
					<Input name="password" placeholder="Password" type="password" />
					<Input
						name="password_confirm"
						placeholder="Confirm password"
						type="password"
					/>
					<Button type="submit">Submit</Button>
				</Form>

				<LinkWrap>
					<Link to="/login">Back to Login</Link>
				</LinkWrap>
			</Wrap>
		</Container>
	);
};

// value === getValues("password") || "The passwords do not match"

const Wrap = styled.div`
	margin-top: 60px;
	padding: 40px;
	width: 100%;
	max-width: 420px;
	min-height: 500px;
	height: 500px;
	background-color: #212125;
	border-radius: 14px;
`;

const LinkWrap = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 10px;

	a {
		text-decoration: none;
		color: #fff;
	}
`;

export default Register;
