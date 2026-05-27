import { useState } from "react";
import { Mail, Send, User, MessageSquare } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

export function FormPage() {
  const { trigger } = useWebHaptics();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger("medium");

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields before submitting");
      return;
    }

    setIsSubmitting(true);

    // Simulate API Submission
    setTimeout(() => {
      setIsSubmitting(false);
      trigger("success");
      toast.success("Feedback submitted successfully!");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col gap-1 bg-panel border border-border/80 p-5 rounded-2xl shadow-xs">
        <h1 className="text-text text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <Mail className="size-5.5 text-primary" />
          Feedback Form
        </h1>
        <p className="text-text-muted text-xs md:text-sm font-medium">
          Send us your comments, bug reports, or feature requests.
        </p>
      </div>

      {/* Main Form Card */}
      <Card className="bg-panel border border-border/80 shadow-sm rounded-2xl overflow-hidden pt-0">
        {/* Decorative Header Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary-hover" />

        <CardHeader className="p-5 md:p-6 pb-3">
          <CardTitle className="text-base font-extrabold text-text">
            Submit Feedback
          </CardTitle>
          <CardDescription className="text-xs font-semibold text-text-muted">
            All fields are required. We usually respond within 24 hours.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 md:p-6 pt-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FieldGroup className="gap-4">
              {/* Name field */}
              <Field>
                <FieldLabel
                  htmlFor="name"
                  className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-1.5"
                >
                  <User className="size-3.5 text-primary" />
                  Full Name
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 h-11 px-3.5 text-sm bg-background text-text transition-all duration-200"
                  disabled={isSubmitting}
                  required
                />
              </Field>

              {/* Email field */}
              <Field>
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-1.5"
                >
                  <Mail className="size-3.5 text-primary" />
                  Email Address
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 h-11 px-3.5 text-sm bg-background text-text transition-all duration-200"
                  disabled={isSubmitting}
                  required
                />
              </Field>

              {/* Message field */}
              <Field>
                <FieldLabel
                  htmlFor="message"
                  className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-1.5"
                >
                  <MessageSquare className="size-3.5 text-primary" />
                  Your Message
                </FieldLabel>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 px-3.5 py-3 text-sm bg-background text-text transition-all duration-200 min-h-[120px] resize-y"
                  disabled={isSubmitting}
                  required
                />
              </Field>
            </FieldGroup>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-2 border-t border-border/40 mt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl px-5 h-11 bg-primary text-primary-foreground hover:bg-primary-hover active:scale-98 font-bold text-xs gap-2 tracking-wide uppercase transition-all duration-200 cursor-pointer w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="size-3.5" data-icon="inline-start" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export default FormPage;
