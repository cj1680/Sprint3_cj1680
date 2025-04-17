import {
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useSpeechSynthesis } from 'react-speech-kit';
import { useEffect, useRef } from 'react';

export default function Auth({props, setToken}) {
  const [type, toggle] = useToggle(['login', 'register']);
  const inputRef = useRef(null);
  const signInRef = useRef(null);

  const { speak } = useSpeechSynthesis();

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (values) => {
    const endpoint = type === 'login' ? '/login' : '/register';

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        speak({text: data.message}) // Say success message
        if (data.token) {
          localStorage.setItem('mathsterToken', data.token);
          setToken(data.token);
        } else {
          console.log('no token');
        }
      } else {
        alert(data.error); // Show error message
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSpeak = (field) => {
    window.speechSynthesis.cancel();
    speak({ text: field });
  }

  return (
    <Paper radius="md" pt="40px" withBorder {...props}>
      <Text size="lg" fw={500}>
        {upperFirst(type)}
      </Text>

      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="Your email"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
            ref={inputRef}
            onFocus={() => handleSpeak('enter an email')}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
            onFocus={() => handleSpeak('enter a password. Must be at least 6 characters long')}
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" 
            type="button" 
            c="dimmed" 
            onClick={() => {handleSpeak(type === 'register' ? "Don't have an account? Register" : 'Already have an account? Login'); toggle()}} 
            size="xs"
            onFocus={() => handleSpeak(type === 'register' ? 'Already have an account? Login' : "Don't have an account? Register")}
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl" style={{ backgroundColor: 'black', color: 'white' }} ref={signInRef} onFocus={() => handleSpeak(type)}>
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
