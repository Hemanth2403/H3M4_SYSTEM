import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Upload, ShieldCheck, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
  category: z.string(),
  severity: z.string(),
  description: z.string().min(50, {
    message: "Description must be detailed (at least 50 characters).",
  }),
  poc: z.string().optional(),
});

export default function SubmitResearch() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      severity: "",
      description: "",
      poc: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Research Submitted for Verification",
      description: "Your submission has been encrypted and sent to the H3M4 review team.",
    });
    console.log(values);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/30">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-heading font-bold">Submit New Research</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Contribute to the vault. All submissions are encrypted, verified, and eligible for bounties based on the H3M4 Threat Score.
        </p>
      </div>

      <div className="bg-card/40 backdrop-blur-md border border-border rounded-xl p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vulnerability Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., OAuth 2.0 State Parameter Bypass in..." className="bg-background/50 border-white/10" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title describing the issue.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-white/10">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web">Web Application</SelectItem>
                        <SelectItem value="api">API Security</SelectItem>
                        <SelectItem value="cloud">Cloud Infrastructure</SelectItem>
                        <SelectItem value="mobile">Mobile Security</SelectItem>
                        <SelectItem value="iot">IoT / Hardware</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Severity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-white/10">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Description & Impact</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the vulnerability, how to reproduce it, and its potential business impact..." 
                      className="min-h-[150px] bg-background/50 border-white/10 font-mono text-sm" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="poc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proof of Concept (Optional)</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer group">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="text-sm text-muted-foreground mb-1">Drag & drop files or click to upload</p>
                      <p className="text-xs text-muted-foreground/50">Supports .txt, .pdf, .py, .js (Max 10MB)</p>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Securely upload screenshots, logs, or script files.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3 text-sm text-yellow-200/80">
              <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
              <p>By submitting, you agree to the H3M4 Responsible Disclosure Policy. Do not exploit vulnerabilities beyond proof of concept.</p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" className="border-white/10 hover:bg-white/5">Save Draft</Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8">Submit Research</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}