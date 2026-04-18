import { CreateUserType, ExceptionType } from '@nonogram-api-monorepo/types';
import { useLazySignupQuery } from '../../../store/api';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { HTTP_ERROR_MESSAGES } from '../../../constants';
import {
  Button,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Separator,
} from '@nonogram-api-monorepo/ui-kit';

export const SignupForm: React.FC = () => {
  const [userSignupDto, setUserSignupDto] = useState<CreateUserType>({
    username: '',
    password: '',
    personalNumber: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [signupQuery] = useLazySignupQuery();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userSignupDto.password.trim() !== '' && userSignupDto.personalNumber) {
      try {
        const result = await signupQuery(userSignupDto).unwrap();

        if (result) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        const e = error as ExceptionType;

        if (HTTP_ERROR_MESSAGES[e.status]) {
          toast.error(HTTP_ERROR_MESSAGES[e.status]);
        } else {
          toast.error('error');
        }
      }
    } else {
      toast.error('Fill out the form');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSignupDto((prev) => ({
      ...prev,
      [name]: name === 'personalNumber' ? parseInt(value, 10) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full w-1/2">
      <FieldGroup className="flex flex-col gap-[2rem] md:gap-[3.5rem] items-center w-full h-full">
        <Field className="flex flex-col w-full sm:w-2/3 h-9">
          <FieldLabel>Personal Number:</FieldLabel>
          <Input
            value={
              userSignupDto.personalNumber ? userSignupDto.personalNumber : ''
            }
            name="personalNumber"
            onChange={handleChange}
            type="number"
            placeholder="1234567"
            className="rounded-lg border border-absoluteBlack w-full h-9 p-3 bg-absoluteWhite [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
        </Field>
        <Field className="flex flex-col w-full sm:w-2/3 h-9">
          <FieldLabel>Username:</FieldLabel>
          <Input
            value={userSignupDto.username}
            name="username"
            onChange={handleChange}
            type="text"
            placeholder="Moshe"
            className="rounded-lg border border-absoluteBlack w-full h-9 p-3 bg-absoluteWhite"
            required
          />
        </Field>
        <Field className="flex flex-col w-full sm:w-2/3 h-9">
          <FieldLabel>Password:</FieldLabel>
          <InputGroup className="rounded-lg border border-absoluteBlack w-full h-9 relative bg-absoluteWhite">
            <InputGroupInput
              value={userSignupDto.password}
              name="password"
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              placeholder="StrongPassword123!"
              className="p-3"
              required
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-lg disabled:cursor-not-allowed"
                disabled={!userSignupDto.password}
              >
                {showPassword ? '🙈' : '👁️'}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <div className="w-full h-full flex flex-col items-center gap-10">
          <Button
            type="submit"
            className="bg-signupPageOrange w-1/2 sm:w-1/4 h-9 border border-absoluteBlack rounded-lg hover:scale-105 active:scale-95 transition-transform"
          >
            Sign up
          </Button>
          <div className="relative items-center gap-2 w-1/2 hidden md:flex">
            <Separator
              className="flex-1 border-absoluteBlack/20"
              orientation="vertical"
            />
            <span className="px-2 text-muted-foreground text-xs uppercase">
              OR
            </span>
            <Separator className="flex-1 border-absoluteBlack/20" />
          </div>
          <Link to="/" className="w-1/3 sm:w-1/5 h-9">
            <Button className="bg-absoluteWhite/70 w-full h-full border border-absoluteBlack rounded-lg hover:scale-105 active:scale-95 transition-transform">
              Log in
            </Button>
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
};
