import { ReactNode } from 'react';
import { Modal } from './Modal';
import Button from './Button';
import { Icons } from './Icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const variantStyles = {
  danger: {
    icon: <Icons.Trash className="w-12 h-12 text-red-600" />,
    buttonVariant: 'danger' as const,
    bgColor: 'bg-red-50',
  },
  warning: {
    icon: <Icons.Clock className="w-12 h-12 text-yellow-600" />,
    buttonVariant: 'secondary' as const,
    bgColor: 'bg-yellow-50',
  },
  info: {
    icon: <Icons.Eye className="w-12 h-12 text-blue-600" />,
    buttonVariant: 'primary' as const,
    bgColor: 'bg-blue-50',
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false,
}: ConfirmDialogProps) {
  const style = variantStyles[variant];

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={style.buttonVariant} onClick={handleConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="text-center py-4">
        <div className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full ${style.bgColor} mb-4`}>
          {style.icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="text-sm text-gray-600">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>
      </div>
    </Modal>
  );
}
