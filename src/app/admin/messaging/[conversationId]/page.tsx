import ConversationDetails from './ConversationDetails';
import { Spinner } from '@/components/ui/spinner';

// Server component that renders the conversation details
export default function ConversationPage({ params }: { params: { conversationId: string } }) {
  const { conversationId } = params;
  
  return (
    <div className="container mx-auto p-4">
      <ConversationDetails conversationId={conversationId} />
    </div>
  );
} 