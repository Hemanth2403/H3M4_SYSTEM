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
import { toast } from "sonner";
import { Upload, ShieldCheck, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { insertSubmissionSchema } from "@shared/schema";

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
  category: z.string(),
  research_type: z.string(),
  severity: z.string(),
  description: z.string().min(50, {
    message: "Description must be detailed (at least 50 characters).",
  }),
  impact_analysis: z.string().optional(),
  affected_systems: z.string().optional(),
  poc: z.string().optional(),
  agreement: z.boolean().default(false).refine((val) => val === true, {
    message: "You must agree to the ethical disclosure policy.",
  }),
});

export default function SubmitResearch() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      research_type: "",
      severity: "",
      description: "",
      impact_analysis: "",
      affected_systems: "",
      poc: "",
      agreement: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const submissionData = {
        title: values.title,
        category: values.category,
        researchType: values.research_type,
        severity: values.severity,
        description: values.description,
        impactAnalysis: values.impact_analysis,
        affectedSystems: values.affected_systems,
        poc: values.poc,
        userId: user?.id || "anonymous",
        author: user?.name || "Anonymous",
      };

      await apiRequest("POST", "/api/submissions", submissionData);
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });

      toast.success("Research Submitted for Verification", {
        description: "Your submission has been encrypted and sent to the H3M4 review team.",
      });

      setLocation("/activity");
    } catch (error: any) {
      toast.error("Submission Failed", {
        description: error.message
      });
    }
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                name="research_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-white/10">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="attack_technique">Attack Technique</SelectItem>
                        <SelectItem value="threat_model">Threat Model / Hypothesis</SelectItem>
                        <SelectItem value="misconfig">Misconfiguration Pattern</SelectItem>
                        <SelectItem value="exploit_chain">Exploit Path Chain</SelectItem>
                        <SelectItem value="mitigation_validation">Mitigation Validation</SelectItem>
                        <SelectItem value="zero_day">Zero-Day (Undisclosed)</SelectItem>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="impact_analysis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Impact Analysis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is the potential loss? (Data, Financial, Reputation)"
                        className="min-h-[100px] bg-background/50 border-white/10 font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="affected_systems"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affected Systems / Components</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List specific APIs, DBs, or Cloud Resources..."
                        className="min-h-[100px] bg-background/50 border-white/10 font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="agreement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-primary/20 bg-primary/5 p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 mt-1 rounded border-primary/50 bg-background text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold">
                      Ethical Disclosure Agreement
                    </FormLabel>
                    <FormDescription>
                      I confirm that I have operated within the H3M4 Mission Protocol, avoided production exploitation, and agree to the mandatory session logging. I am submitting this as an Intelligence Contributor under governing legal guardrails.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

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