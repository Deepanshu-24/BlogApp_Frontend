import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { ImagePlus, X, Loader2, ArrowLeft, Feather } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "@/hooks/use-posts";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-auth";

export default function CreatePost() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: user, isLoading } = useUser();
  const createPost = useCreatePost();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  if (!isLoading && !user) {
    setTimeout(() => setLocation("/login"), 0);
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createPost.mutate({ title, content, file: file as any }, {
      onSuccess: () => {
        toast({ title: "Post published successfully!" });
        setLocation("/");
      },
      onError: (err: any) => {
        toast({ title: "Failed to publish", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen notebook-page relative">
      <Navbar />

      {/* Book spine shadow on left */}
      <div className="fixed top-0 left-0 bottom-0 w-16 pointer-events-none z-40 hidden lg:block" style={{
        background: 'linear-gradient(to right, rgba(80, 55, 30, 0.06), transparent)',
      }} />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-amber-800/40 hover:text-amber-800/70 mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h1 className="text-4xl font-display font-bold mb-8" style={{ color: 'hsl(25, 35%, 15%)' }}>
          Write a new post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 leather-card p-6 sm:p-8 rounded-xl">
          <div className="space-y-2">
            <label className="text-xs font-semibold ml-1 text-amber-900/50 tracking-wider uppercase">Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="What's on your mind?" 
              className="text-xl font-display font-medium h-14 px-5 bg-white/40 border-amber-800/12 focus:border-amber-700/25 rounded-lg"
              required 
              minLength={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold ml-1 text-amber-900/50 tracking-wider uppercase">Content</label>
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Write your story here..." 
              className="min-h-[250px] text-base p-5 leading-relaxed bg-white/40 border-amber-800/12 focus:border-amber-700/25 quill-input rounded-lg"
              style={{ lineHeight: '2', backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 31px, rgba(160, 140, 120, 0.08) 31px, rgba(160, 140, 120, 0.08) 32px)', backgroundSize: '100% 32px', backgroundPositionY: '15px' }}
              required 
              minLength={3}
              maxLength={1000}
            />
            <div className="text-right text-xs text-amber-800/30">
              {content.length}/1000
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold ml-1 text-amber-900/50 tracking-wider uppercase">Cover Image (Optional)</label>
            
            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-amber-800/15 group">
                <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-amber-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="gap-2 rounded-md">
                    <X className="w-4 h-4" /> Remove Image
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-32 border-2 border-dashed border-amber-800/15 rounded-lg flex flex-col items-center justify-center text-amber-800/30 hover:bg-amber-800/3 hover:text-amber-800/50 hover:border-amber-800/25 transition-all cursor-pointer"
              >
                <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm font-medium">Click to upload an image</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="pt-6 flex justify-end" style={{ borderTop: '1px solid rgba(160, 130, 90, 0.2)' }}>
            <Button 
              type="submit" 
              size="lg" 
              className="rounded-md px-8 wax-seal-btn font-display tracking-wide gap-2"
              disabled={createPost.isPending || !title.trim() || !content.trim()}
            >
              {createPost.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Feather className="w-4 h-4" />}
              {createPost.isPending ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
