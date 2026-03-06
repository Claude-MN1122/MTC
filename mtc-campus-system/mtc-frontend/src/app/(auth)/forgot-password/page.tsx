'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate password reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-gold-50">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors mb-6"
        >
          <FiArrowLeft className="text-lg" />
          <span className="font-medium">Back to login</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4"
          >
            <FiMail className="text-3xl text-primary-600" />
          </motion.div>
          
          <h1 className="text-h2 text-text-primary mb-2">
            Forgot Password?
          </h1>
          <p className="text-body text-text-secondary">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        {/* Form */}
        <Card variant="elevated" padding="lg" className="backdrop-blur-sm bg-white/90">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <Alert variant="success" className="mb-6">
                Check your email! We've sent password reset instructions to{' '}
                <strong>{email}</strong>
              </Alert>
              
              <div className="space-y-4">
                <p className="text-small text-text-muted">
                  Didn't receive the email?
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="error" onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Input
                type="email"
                label="Email Address"
                placeholder="admin@mtc.ac.zw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<FiMail className="text-lg" />}
                hint="Enter the email associated with your account"
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          {!isSubmitted && (
            <div className="mt-6 pt-6 border-t border-border-light">
              <p className="text-center text-small text-text-muted">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </Card>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-caption text-text-muted mt-6"
        >
          © 2026 Mutare Teachers College. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}
