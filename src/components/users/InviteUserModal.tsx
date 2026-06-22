"use client";

import Modal from "@/components/ui/modal";
import InviteUserForm from "@/components/users/InviteUserForm";

type InviteUserModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function InviteUserModal({ open, onClose }: InviteUserModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite User"
      description="Send an invitation link to grant access."
      accent
      className="max-w-md overflow-hidden rounded-xl"
    >
      <InviteUserForm onCancel={onClose} />
    </Modal>
  );
}

