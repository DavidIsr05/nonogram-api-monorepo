import { ExceptionType, UserSignInType } from '@nonogram-api-monorepo/types';
import { useLazyLoginQuery } from '../../../store/api';
import { useDispatch } from 'react-redux';
import { setUserId } from '../../../store/slices';
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
} from '@nonogram-api-monorepo/ui';

export const LoginForm: React.FC = () => {
  const [userSignInDto, setUserSignInDto] = useState<UserSignInType>({
    personalNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginQuery] = useLazyLoginQuery();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userSignInDto.password.trim() !== '' && userSignInDto.personalNumber) {
      try {
        userSignInDto.personalNumber = parseInt(userSignInDto.personalNumber);
        const result = await loginQuery(userSignInDto).unwrap();

        if (typeof result.access_token === 'string') {
          dispatch(setUserId(result.userId));
          navigate('/home', { replace: true });
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
    setUserSignInDto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="h-full w-1/2 flex">
      <FieldGroup className="flex flex-col gap-[3rem] md:gap-[4rem] items-center">
        <Field className="w-full sm:w-2/3 h-9 flex flex-col">
          <FieldLabel className="text-md">Personal Number:</FieldLabel>
          <Input
            value={userSignInDto.personalNumber}
            name="personalNumber"
            onChange={handleChange}
            type="number"
            placeholder="1234567"
            className="rounded-lg bg-absoluteWhite border border-absoluteBlack w-full h-9 p-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
        </Field>
        <Field className="flex flex-col w-full sm:w-2/3 h-9">
          <FieldLabel className="text-md">Password:</FieldLabel>
          <InputGroup className="rounded-lg border border-absoluteBlack w-full h-9 relative bg-absoluteWhite">
            <InputGroupInput
              value={userSignInDto.password}
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
                disabled={!userSignInDto.password}
              >
                {showPassword ? '🙈' : '👁️'}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <div className="w-full h-full flex flex-col items-center gap-10">
          <Button
            type="submit"
            className="bg-loginPagePurple w-1/4 h-9 border border-absoluteBlack rounded-lg hover:scale-105 active:scale-95 transition-transform"
          >
            Log In
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
          <Link to="/signup" className="w-1/4 h-9">
            <Button className="bg-absoluteWhite/70 w-full h-full border border-absoluteBlack rounded-lg hover:scale-105 active:scale-95 transition-transform">
              Sign Up
            </Button>
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
};
