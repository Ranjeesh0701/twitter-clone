"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

import useLoginModal from "@/hooks/useLoginModal";
import { useCallback, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import useRegisterModal from "@/hooks/useRegisterModal";

const RegisterModal: React.FC = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.post("http://localhost:3000/api/register", {
        email,
        password,
        username,
        name,
      });

      toast.success("Account created");
      signIn("credentials", {
        email,
        password,
      });

      registerModal.onClose();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [registerModal, setIsLoading, email, password, username, name]);

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }
    registerModal.onClose();
    loginModal.onOpen();
  }, [isLoading, registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Name"
        onChange={(event) => setName(event.target.value)}
        value={name}
        disabled={isLoading}
        type="text"
      />
      <Input
        placeholder="Username"
        onChange={(event) => setUsername(event.target.value)}
        value={username}
        disabled={isLoading}
        type="text"
      />
      <Input
        placeholder="Email"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
        disabled={isLoading}
        type="email"
      />
      <Input
        placeholder="Password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        disabled={isLoading}
        type="password"
      />
    </div>
  );

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        Already have an account?
        <span
          className="text-white cursor-pointer hover:underline"
          onClick={onToggle}
        >
          {" "}
          Sign in
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Create an account"
      actionLabel="Sign up"
      onClose={registerModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
