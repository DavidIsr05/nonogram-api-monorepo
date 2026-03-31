import { ExceptionType, UpdateUserType } from '@nonogram-api-monorepo/types';
import { HTTP_ERROR_MESSAGES } from '../../../../constants';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useUpdateUserMutation } from '../../../../store/api';

type Props = UpdateUserType & { personalNumber: number };

export const UserInfo: React.FC<Props> = ({ id, username, personalNumber }) => {
  const [editUserDto, setEditUserDto] = useState<UpdateUserType>({
    id,
    username,
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const [updateUser] = useUpdateUserMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUserDto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let editUserDtoEditedFields: UpdateUserType = {
      id,
    };

    if (
      editUserDto.username &&
      editUserDto.username.trim() !== '' &&
      editUserDto.username !== username
    ) {
      editUserDtoEditedFields = {
        ...editUserDtoEditedFields,
        username: editUserDto.username,
      };
    }

    if (editUserDto.password && editUserDto.password.trim() !== '') {
      editUserDtoEditedFields = {
        ...editUserDtoEditedFields,
        password: editUserDto.password,
      };
    }

    if (editUserDtoEditedFields.username || editUserDtoEditedFields.password) {
      try {
        const result = await updateUser(editUserDtoEditedFields).unwrap();

        if (result) {
          toast.info('Updated info');
        }
      } catch (error) {
        const e = error as ExceptionType;

        if (HTTP_ERROR_MESSAGES[e.status]) {
          toast.error(HTTP_ERROR_MESSAGES[e.status]);
        } else {
          toast.error('error acuared while updating useer information');
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 p-5 w-[90%] xl:w-[50%] h-auto border-b border-b-absoluteBlack xl:border-r xl:border-b-0 border-r-absoluteBlack">
      <span className="text-2xl font-medium">Update User Info:</span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 items-center w-full"
      >
        <div className="flex flex-col items-center w-[50%] xl:w-[40%]">
          <label className="self-start text-sm">Personal Number:</label>
          <div className="rounded-xl border border-absoluteBlack w-full h-9 p-3 flex items-center">
            {personalNumber}
          </div>
        </div>
        <div className="flex flex-col items-center w-[50%] xl:w-[40%]">
          <label className="self-start text-sm">Username:</label>
          <input
            value={editUserDto.username}
            name="username"
            onChange={handleChange}
            type="text"
            placeholder="Username:"
            className="rounded-xl border border-absoluteBlack w-full h-9 p-3"
          />
        </div>
        <div className="flex flex-col items-center w-[50%] xl:w-[40%]">
          <label className="self-start text-sm">Password:</label>
          <div className="relative w-full">
            <input
              value={editUserDto.password}
              name="password"
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password:"
              className="rounded-xl border border-absoluteBlack w-full h-9 p-3 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xl"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-buttonGreen w-[20%] xl:w-[15%] h-9 border border-absoluteBlack rounded-xl text-base hover:scale-105 active:scale-95 transition-transform"
        >
          Update
        </button>
      </form>
    </div>
  );
};
