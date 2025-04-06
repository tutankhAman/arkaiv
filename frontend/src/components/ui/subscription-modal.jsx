import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Label } from './label';

const SubscriptionModal = ({ isOpen, onClose, onSubmit }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = () => {
    if (termsAccepted) {
      onSubmit();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray text-black border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">Subscribe to AI Digest</DialogTitle>
          <DialogDescription className="text-zinc-300">
            Get daily updates about new AI tools and research directly in your inbox.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-white">What you'll receive:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-300">
              <li>Daily digest of new AI tools and their summaries</li>
              <li>Author digest with latest research updates</li>
              <li>Weekly roundup of trending AI projects</li>
            </ul>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={setTermsAccepted}
              className="border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="terms" className="text-sm text-zinc-300">
              I agree to receive daily emails from arkaiv at 8:00 AM with AI updates and digests.
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="text-white border-zinc-700 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!termsAccepted}
            className="bg-primary hover:bg-primary/90"
          >
            Subscribe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal; 