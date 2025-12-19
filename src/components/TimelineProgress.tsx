import { type Checkpoint } from '@/data/shipments';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface TimelineProgressProps {
  checkpoints: Checkpoint[];
}

const TimelineProgress = ({ checkpoints }: TimelineProgressProps) => {
  const getStatusIcon = (status: string, index: number) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'current':
        return (
          <div className="relative">
            <Clock className="h-5 w-5 text-warning animate-pulse" />
          </div>
        );
      case 'pending':
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'current':
        return 'bg-warning text-warning-foreground';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'current':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {checkpoints.map((checkpoint, index) => (
        <div key={checkpoint.id} className="relative">
          {/* Connection Line */}
          {index < checkpoints.length - 1 && (
            <div className="absolute left-2.5 top-8 w-0.5 h-16 bg-border" />
          )}
          
          <div className="flex items-start space-x-4">
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(checkpoint.status, index)}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{checkpoint.location}</h4>
                  <p className="text-sm text-muted-foreground">{checkpoint.date}</p>
                </div>
                <Badge className={`ml-2 ${getStatusColor(checkpoint.status)}`}>
                  {getStatusText(checkpoint.status)}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {checkpoint.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineProgress;