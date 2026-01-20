import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const postSchema = yup.object({
  title: yup.string().min(5, 'Title must be at least 5 characters').max(100, 'Title is too long').required('Title is required'),
  content: yup.string().min(50, 'Content must be at least 50 characters').required('Content is required'),
  category: yup.string().required('Category is required'),
  tags: yup.array().of(yup.string()).min(1, 'Add at least one tag'),
});