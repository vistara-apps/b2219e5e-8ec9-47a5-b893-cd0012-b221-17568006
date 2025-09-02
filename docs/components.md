# InfluencerMatch Component Documentation

This document provides comprehensive documentation for the UI components used in the InfluencerMatch platform.

## Table of Contents

1. [Layout Components](#layout-components)
   - [Navbar](#navbar)
   - [Footer](#footer)
   - [Sidebar](#sidebar)
2. [Authentication Components](#authentication-components)
   - [LoginForm](#loginform)
   - [RegisterForm](#registerform)
3. [Campaign Components](#campaign-components)
   - [CampaignBriefForm](#campaignbriefform)
   - [CampaignDetails](#campaigndetails)
   - [CampaignList](#campaignlist)
4. [Influencer Components](#influencer-components)
   - [InfluencerCard](#influencercard)
   - [InfluencerProfile](#influencerprofile)
   - [SocialAccountForm](#socialaccountform)
5. [Analytics Components](#analytics-components)
   - [AnalyticsChart](#analyticschart)
   - [PerformanceMetrics](#performancemetrics)
   - [DemographicsDisplay](#demographicsdisplay)
6. [Messaging Components](#messaging-components)
   - [MessageList](#messagelist)
   - [MessageThread](#messagethread)
   - [MessageComposer](#messagecomposer)
7. [UI Components](#ui-components)
   - [Button](#button)
   - [Card](#card)
   - [Input](#input)
   - [Modal](#modal)
   - [Dropdown](#dropdown)
   - [Tabs](#tabs)

## Layout Components

### Navbar

The main navigation component that appears at the top of every page.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| transparent | boolean | false | Whether the navbar should have a transparent background |

**Usage:**

```jsx
import Navbar from '@/components/layout/Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
```

### Footer

The footer component that appears at the bottom of every page.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| simplified | boolean | false | Whether to show a simplified version of the footer |

**Usage:**

```jsx
import Footer from '@/components/layout/Footer';

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

### Sidebar

The sidebar navigation component used in the dashboard.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| userRole | string | null | The role of the current user ('business' or 'influencer') |
| collapsed | boolean | false | Whether the sidebar is collapsed |
| onToggleCollapse | function | () => {} | Function to toggle the collapsed state |

**Usage:**

```jsx
import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="flex">
      <Sidebar 
        userRole="business" 
        collapsed={collapsed} 
        onToggleCollapse={() => setCollapsed(!collapsed)} 
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

## Authentication Components

### LoginForm

Form component for user login.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| onSuccess | function | () => {} | Callback function called after successful login |
| redirectUrl | string | '/dashboard' | URL to redirect to after successful login |

**Usage:**

```jsx
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto">
      <h1>Sign In</h1>
      <LoginForm 
        onSuccess={() => console.log('Login successful')} 
        redirectUrl="/dashboard" 
      />
    </div>
  );
}
```

### RegisterForm

Form component for user registration.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| onSuccess | function | () => {} | Callback function called after successful registration |
| redirectUrl | string | '/onboarding' | URL to redirect to after successful registration |
| initialRole | string | null | Initial role selection ('business' or 'influencer') |

**Usage:**

```jsx
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="container mx-auto">
      <h1>Create Account</h1>
      <RegisterForm 
        onSuccess={() => console.log('Registration successful')} 
        redirectUrl="/onboarding" 
        initialRole="business" 
      />
    </div>
  );
}
```

## Campaign Components

### CampaignBriefForm

Form component for creating or editing campaign briefs.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| onSubmit | function | required | Callback function called when the form is submitted |
| initialData | object | {} | Initial data for the form fields |

**Usage:**

```jsx
import CampaignBriefForm from '@/components/campaigns/CampaignBriefForm';

export default function CreateCampaignPage() {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // Submit data to API
  };
  
  return (
    <div className="container mx-auto">
      <h1>Create Campaign</h1>
      <CampaignBriefForm onSubmit={handleSubmit} />
    </div>
  );
}
```

### CampaignDetails

Component for displaying detailed campaign information.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| campaign | object | required | Campaign data object |
| editable | boolean | false | Whether the campaign details can be edited |
| onEdit | function | () => {} | Callback function called when the edit button is clicked |

**Usage:**

```jsx
import CampaignDetails from '@/components/campaigns/CampaignDetails';

export default function CampaignPage({ campaign }) {
  return (
    <div className="container mx-auto">
      <CampaignDetails 
        campaign={campaign} 
        editable={true} 
        onEdit={() => console.log('Edit clicked')} 
      />
    </div>
  );
}
```

### CampaignList

Component for displaying a list of campaigns.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| campaigns | array | required | Array of campaign objects |
| loading | boolean | false | Whether the campaigns are loading |
| onSelect | function | () => {} | Callback function called when a campaign is selected |
| emptyMessage | string | 'No campaigns found' | Message to display when there are no campaigns |

**Usage:**

```jsx
import CampaignList from '@/components/campaigns/CampaignList';

export default function CampaignsPage({ campaigns, loading }) {
  return (
    <div className="container mx-auto">
      <h1>Your Campaigns</h1>
      <CampaignList 
        campaigns={campaigns} 
        loading={loading} 
        onSelect={(campaign) => console.log('Selected:', campaign)} 
      />
    </div>
  );
}
```

## Influencer Components

### InfluencerCard

Card component for displaying influencer information.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| influencer | object | required | Influencer data object |
| variant | string | 'basic' | Card variant ('basic' or 'detailed') |
| onSelect | function | null | Callback function called when the card is clicked |
| selected | boolean | false | Whether the card is selected |

**Usage:**

```jsx
import InfluencerCard from '@/components/influencer/InfluencerCard';

export default function InfluencersPage({ influencers }) {
  return (
    <div className="container mx-auto">
      <h1>Top Influencers</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {influencers.map((influencer) => (
          <InfluencerCard 
            key={influencer.id} 
            influencer={influencer} 
            variant="detailed" 
            onSelect={(id) => console.log('Selected:', id)} 
          />
        ))}
      </div>
    </div>
  );
}
```

### InfluencerProfile

Component for displaying a detailed influencer profile.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| profile | object | required | Influencer profile data object |
| editable | boolean | false | Whether the profile can be edited |
| onEdit | function | () => {} | Callback function called when the edit button is clicked |

**Usage:**

```jsx
import InfluencerProfile from '@/components/influencer/InfluencerProfile';

export default function ProfilePage({ profile }) {
  return (
    <div className="container mx-auto">
      <InfluencerProfile 
        profile={profile} 
        editable={true} 
        onEdit={() => console.log('Edit clicked')} 
      />
    </div>
  );
}
```

### SocialAccountForm

Form component for adding or editing social media accounts.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| onSubmit | function | required | Callback function called when the form is submitted |
| initialData | object | {} | Initial data for the form fields |

**Usage:**

```jsx
import SocialAccountForm from '@/components/influencer/SocialAccountForm';

export default function AddSocialAccountPage() {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // Submit data to API
  };
  
  return (
    <div className="container mx-auto">
      <h1>Add Social Account</h1>
      <SocialAccountForm onSubmit={handleSubmit} />
    </div>
  );
}
```

## Analytics Components

### AnalyticsChart

Component for displaying various types of charts for analytics data.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| data | array | required | Array of data points for the chart |
| variant | string | 'bar' | Chart type ('bar', 'line', or 'pie') |
| height | number | 300 | Height of the chart in pixels |
| width | string | '100%' | Width of the chart |
| colors | array | ['#4F46E5', ...] | Array of colors for the chart elements |

**Usage:**

```jsx
import AnalyticsChart from '@/components/analytics/AnalyticsChart';

export default function AnalyticsPage({ data }) {
  return (
    <div className="container mx-auto">
      <h1>Performance Trends</h1>
      <div className="h-64">
        <AnalyticsChart 
          data={data} 
          variant="line" 
          colors={['#4F46E5', '#10B981']} 
        />
      </div>
    </div>
  );
}
```

### PerformanceMetrics

Component for displaying key performance metrics.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| metrics | object | required | Object containing performance metrics |
| comparison | object | null | Object containing comparison metrics for showing change |
| layout | string | 'grid' | Layout style ('grid' or 'inline') |

**Usage:**

```jsx
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';

export default function DashboardPage({ metrics, previousMetrics }) {
  return (
    <div className="container mx-auto">
      <h1>Performance Overview</h1>
      <PerformanceMetrics 
        metrics={metrics} 
        comparison={previousMetrics} 
        layout="grid" 
      />
    </div>
  );
}
```

### DemographicsDisplay

Component for displaying audience demographics.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| demographics | object | required | Object containing demographic data |
| type | string | 'all' | Type of demographics to display ('age', 'gender', 'location', or 'all') |

**Usage:**

```jsx
import DemographicsDisplay from '@/components/analytics/DemographicsDisplay';

export default function AudiencePage({ demographics }) {
  return (
    <div className="container mx-auto">
      <h1>Audience Demographics</h1>
      <DemographicsDisplay demographics={demographics} type="all" />
    </div>
  );
}
```

## Messaging Components

### MessageList

Component for displaying a list of message threads.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| threads | array | required | Array of message thread objects |
| activeThreadId | string | null | ID of the currently active thread |
| onSelectThread | function | () => {} | Callback function called when a thread is selected |
| loading | boolean | false | Whether the threads are loading |

**Usage:**

```jsx
import MessageList from '@/components/messaging/MessageList';

export default function MessagesPage({ threads, activeThreadId }) {
  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        <MessageList 
          threads={threads} 
          activeThreadId={activeThreadId} 
          onSelectThread={(id) => console.log('Selected thread:', id)} 
        />
      </div>
      <div className="w-2/3">
        {/* Message thread content */}
      </div>
    </div>
  );
}
```

### MessageThread

Component for displaying a thread of messages.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| messages | array | required | Array of message objects |
| currentUserId | string | required | ID of the current user |
| loading | boolean | false | Whether the messages are loading |
| loadMore | function | null | Function to load more messages when scrolling to the top |
| hasMore | boolean | false | Whether there are more messages to load |

**Usage:**

```jsx
import MessageThread from '@/components/messaging/MessageThread';

export default function ThreadPage({ messages, currentUserId }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <MessageThread 
          messages={messages} 
          currentUserId={currentUserId} 
          loadMore={() => console.log('Load more messages')} 
          hasMore={true} 
        />
      </div>
      {/* Message composer */}
    </div>
  );
}
```

### MessageComposer

Component for composing and sending messages.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| onSend | function | required | Callback function called when a message is sent |
| disabled | boolean | false | Whether the composer is disabled |
| placeholder | string | 'Type a message...' | Placeholder text for the input field |

**Usage:**

```jsx
import MessageComposer from '@/components/messaging/MessageComposer';

export default function ThreadPage() {
  const handleSend = (message) => {
    console.log('Sending message:', message);
    // Send message to API
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {/* Message thread */}
      </div>
      <div className="border-t">
        <MessageComposer 
          onSend={handleSend} 
          placeholder="Type your message..." 
        />
      </div>
    </div>
  );
}
```

## UI Components

### Button

Reusable button component with various styles and states.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'primary' | Button style variant ('primary', 'secondary', 'outline', 'text') |
| size | string | 'md' | Button size ('sm', 'md', 'lg') |
| disabled | boolean | false | Whether the button is disabled |
| loading | boolean | false | Whether the button is in a loading state |
| fullWidth | boolean | false | Whether the button should take up the full width of its container |
| onClick | function | () => {} | Callback function called when the button is clicked |
| type | string | 'button' | HTML button type ('button', 'submit', 'reset') |
| children | node | required | Button content |

**Usage:**

```jsx
import Button from '@/components/ui/Button';

export default function ExamplePage() {
  return (
    <div className="space-y-4">
      <Button variant="primary" size="md" onClick={() => console.log('Clicked')}>
        Primary Button
      </Button>
      
      <Button variant="secondary" disabled>
        Disabled Button
      </Button>
      
      <Button variant="outline" loading>
        Loading...
      </Button>
      
      <Button variant="text" size="sm">
        Text Button
      </Button>
      
      <Button variant="primary" fullWidth type="submit">
        Submit Form
      </Button>
    </div>
  );
}
```

### Card

Reusable card component for containing content.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'default' | Card style variant ('default', 'elevated', 'outlined') |
| padding | string | 'md' | Card padding ('sm', 'md', 'lg', 'none') |
| className | string | '' | Additional CSS classes |
| onClick | function | null | Callback function called when the card is clicked |
| children | node | required | Card content |

**Usage:**

```jsx
import Card from '@/components/ui/Card';

export default function ExamplePage() {
  return (
    <div className="space-y-4">
      <Card variant="default" padding="md">
        <h2>Default Card</h2>
        <p>This is a default card with medium padding.</p>
      </Card>
      
      <Card variant="elevated" padding="lg" onClick={() => console.log('Card clicked')}>
        <h2>Elevated Card</h2>
        <p>This is an elevated card with large padding that is clickable.</p>
      </Card>
      
      <Card variant="outlined" padding="sm" className="bg-gray-50">
        <h2>Outlined Card</h2>
        <p>This is an outlined card with small padding and a custom background.</p>
      </Card>
    </div>
  );
}
```

### Input

Reusable input component with various types and states.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| type | string | 'text' | Input type ('text', 'email', 'password', etc.) |
| label | string | null | Input label |
| placeholder | string | '' | Input placeholder text |
| value | string | required | Input value |
| onChange | function | required | Callback function called when the input value changes |
| error | string | null | Error message to display |
| disabled | boolean | false | Whether the input is disabled |
| required | boolean | false | Whether the input is required |
| className | string | '' | Additional CSS classes |

**Usage:**

```jsx
import { useState } from 'react';
import Input from '@/components/ui/Input';

export default function ExamplePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <div className="space-y-4">
      <Input 
        type="email" 
        label="Email Address" 
        placeholder="Enter your email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      
      <Input 
        type="password" 
        label="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        error="Password must be at least 8 characters" 
        required 
      />
      
      <Input 
        type="text" 
        label="Username" 
        placeholder="Enter your username" 
        value="" 
        onChange={() => {}} 
        disabled 
      />
    </div>
  );
}
```

### Modal

Reusable modal component for displaying content in a dialog.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | required | Whether the modal is open |
| onClose | function | required | Callback function called when the modal is closed |
| title | string | null | Modal title |
| size | string | 'md' | Modal size ('sm', 'md', 'lg', 'xl', 'full') |
| children | node | required | Modal content |
| footer | node | null | Modal footer content |

**Usage:**

```jsx
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function ExamplePage() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Example Modal" 
        size="md" 
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>Confirm</Button>
          </div>
        }
      >
        <p>This is the modal content.</p>
      </Modal>
    </div>
  );
}
```

### Dropdown

Reusable dropdown component for selecting from a list of options.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| options | array | required | Array of option objects with value and label properties |
| value | any | null | Currently selected value |
| onChange | function | required | Callback function called when the selection changes |
| label | string | null | Dropdown label |
| placeholder | string | 'Select an option' | Placeholder text when no option is selected |
| error | string | null | Error message to display |
| disabled | boolean | false | Whether the dropdown is disabled |
| className | string | '' | Additional CSS classes |

**Usage:**

```jsx
import { useState } from 'react';
import Dropdown from '@/components/ui/Dropdown';

export default function ExamplePage() {
  const [selectedValue, setSelectedValue] = useState(null);
  
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];
  
  return (
    <div className="space-y-4">
      <Dropdown 
        options={options} 
        value={selectedValue} 
        onChange={(value) => setSelectedValue(value)} 
        label="Select an option" 
      />
      
      <Dropdown 
        options={options} 
        value={null} 
        onChange={() => {}} 
        placeholder="Custom placeholder" 
        disabled 
      />
      
      <Dropdown 
        options={options} 
        value={null} 
        onChange={() => {}} 
        error="Please select an option" 
      />
    </div>
  );
}
```

### Tabs

Reusable tabs component for switching between different content sections.

**Props:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| tabs | array | required | Array of tab objects with id and label properties |
| activeTab | string | required | ID of the currently active tab |
| onChange | function | required | Callback function called when a tab is selected |
| variant | string | 'default' | Tab style variant ('default', 'pills', 'underline') |
| children | function | required | Render prop function that receives the active tab ID |

**Usage:**

```jsx
import { useState } from 'react';
import Tabs from '@/components/ui/Tabs';

export default function ExamplePage() {
  const [activeTab, setActiveTab] = useState('tab1');
  
  const tabs = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' },
  ];
  
  return (
    <div>
      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={(tabId) => setActiveTab(tabId)} 
        variant="underline" 
      >
        {(activeTabId) => (
          <div className="p-4 border rounded-b-lg">
            {activeTabId === 'tab1' && <div>Content for Tab 1</div>}
            {activeTabId === 'tab2' && <div>Content for Tab 2</div>}
            {activeTabId === 'tab3' && <div>Content for Tab 3</div>}
          </div>
        )}
      </Tabs>
    </div>
  );
}
```

