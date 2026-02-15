import { useState } from 'react';
import { UserSignInDto } from '../../../../libs/types/src/lib/types';

export const App = () => {
  const [objaa, setObjaa] = useState<UserSignInDto>({
    personalNumber: 0,
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(objaa);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjaa((objaa) => ({
      ...objaa,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={objaa.personalNumber}
        name="personalNumber"
        onChange={handleChange}
      />
      <input value={objaa.password} name="password" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};
