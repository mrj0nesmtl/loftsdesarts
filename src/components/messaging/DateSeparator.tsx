/**
 * DateSeparator component
 * Shows a date separator between message groups in the message thread
 */

interface DateSeparatorProps {
  date: string;
}

export default function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center py-2">
      <div className="flex-grow h-px bg-border"></div>
      <div className="mx-4 text-xs font-medium text-muted-foreground">
        {date}
      </div>
      <div className="flex-grow h-px bg-border"></div>
    </div>
  );
} 