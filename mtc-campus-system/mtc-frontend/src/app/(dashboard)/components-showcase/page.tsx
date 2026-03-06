'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Alert } from '@/components/ui/Alert';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { FiHome, FiUsers, FiStar, FiCheck, FiAlertCircle } from 'react-icons/fi';

export default function ComponentsShowcase() {
  return (
    <DashboardLayout pageTitle="Component Showcase">
      <div className="space-y-8">
        
        {/* Buttons Section */}
        <section>
          <h2 className="text-h2 mb-4">Buttons</h2>
          <Card padding="lg">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="gold">Gold</Button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" isLoading>Loading</Button>
                <Button variant="primary" leftIcon={<FiHome />}>With Icon</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-h2 mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default" padding="md">
              <h3 className="text-h3 mb-2">Default Card</h3>
              <p className="text-body text-text-secondary">
                This is a default card with standard styling.
              </p>
            </Card>
            
            <Card variant="elevated" padding="md">
              <h3 className="text-h3 mb-2">Elevated Card</h3>
              <p className="text-body text-text-secondary">
                This card has stronger shadow for emphasis.
              </p>
            </Card>
            
            <Card variant="interactive" padding="md">
              <h3 className="text-h3 mb-2">Interactive Card</h3>
              <p className="text-body text-text-secondary">
                Hover over this card to see the lift effect.
              </p>
            </Card>
            
            <Card variant="bordered" padding="md">
              <h3 className="text-h3 mb-2">Bordered Card</h3>
              <p className="text-body text-text-secondary">
                This card has a visible border for emphasis.
              </p>
            </Card>
            
            <Card padding="md">
              <CardHeader
                title="Card with Header"
                subtitle="With action button"
                action={<Button size="sm">Action</Button>}
              />
              <p className="text-body text-text-secondary">
                Cards can have headers with titles and actions.
              </p>
            </Card>
            
            <CardSkeleton showHeader paragraphLines={3} />
          </div>
        </section>

        {/* Inputs Section */}
        <section>
          <h2 className="text-h2 mb-4">Inputs</h2>
          <Card padding="lg" className="max-w-2xl">
            <div className="space-y-4">
              <Input
                label="Email Address"
                placeholder="Enter your email"
                leftIcon={<FiUsers />}
              />
              
              <Input
                label="With Error"
                placeholder="This field has an error"
                error="This field is required"
              />
              
              <Input
                label="With Hint"
                placeholder="This field has a hint"
                hint="This is helpful information"
              />
              
              <TextArea
                label="Message"
                placeholder="Type your message here..."
                rows={4}
              />
            </div>
          </Card>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="text-h2 mb-4">Badges</h2>
          <Card padding="lg">
            <div className="flex flex-wrap gap-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="gold" icon={<FiStar />}>Gold</Badge>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Badge variant="success" size="sm">Small</Badge>
              <Badge variant="success" size="md">Medium</Badge>
              <Badge variant="success" size="lg">Large</Badge>
            </div>
          </Card>
        </section>

        {/* Avatars Section */}
        <section>
          <h2 className="text-h2 mb-4">Avatars</h2>
          <Card padding="lg">
            <div className="flex items-center gap-4">
              <Avatar name="John Doe" size="sm" />
              <Avatar name="Jane Smith" size="md" />
              <Avatar name="Admin User" size="lg" />
              <Avatar name="System Admin" size="xl" />
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <Avatar name="Online User" showStatus status="online" size="md" />
              <Avatar name="Busy User" showStatus status="busy" size="md" />
              <Avatar name="Away User" showStatus status="away" size="md" />
              <Avatar name="Offline User" showStatus status="offline" size="md" />
            </div>
          </Card>
        </section>

        {/* Alerts Section */}
        <section>
          <h2 className="text-h2 mb-4">Alerts</h2>
          <Card padding="lg" className="space-y-4">
            <Alert variant="info" title="Information">
              This is an informational alert.
            </Alert>
            
            <Alert variant="success" title="Success!">
              Your operation completed successfully.
            </Alert>
            
            <Alert variant="warning" title="Warning">
              Please review this important warning.
            </Alert>
            
            <Alert variant="error" title="Error Occurred">
              Something went wrong. Please try again.
            </Alert>
          </Card>
        </section>

        {/* Skeletons Section */}
        <section>
          <h2 className="text-h2 mb-4">Skeleton Loaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton showHeader paragraphLines={2} />
            <CardSkeleton showImage showHeader paragraphLines={3} />
            <div className="space-y-3">
              <Skeleton variant="text" height="24px" width="80%" />
              <Skeleton variant="text" height="16px" width="100%" />
              <Skeleton variant="text" height="16px" width="90%" />
              <Skeleton variant="circular" width="48px" height="48px" />
            </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
