import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Check,
  Share2
} from "lucide-react";
import { useState } from "react";

export interface ShareContent {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
}

interface ShareButtonsProps {
  content: ShareContent;
  onShare?: (platform: string) => void;
}

export function ShareButtons({ content, onShare }: ShareButtonsProps) {
  const [shared, setShared] = useState<string | null>(null);

  const handleShare = (platform: string, shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400");
    setShared(platform);
    onShare?.(platform);
    setTimeout(() => setShared(null), 2000);
  };

  const baseUrl = content.url || window.location.href;
  const encodedTitle = encodeURIComponent(content.title);
  const encodedDescription = encodeURIComponent(content.description);

  const shareLinks = [
    {
      platform: "twitter",
      label: "Twitter",
      icon: Twitter,
      color: "bg-blue-500 hover:bg-blue-600",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${baseUrl}`,
      bgLight: "bg-blue-50"
    },
    {
      platform: "facebook",
      label: "Facebook",
      icon: Facebook,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.facebook.com/sharer/sharer.php?u=${baseUrl}`,
      bgLight: "bg-blue-50"
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${baseUrl}`,
      bgLight: "bg-blue-50"
    },
    {
      platform: "email",
      label: "Email",
      icon: Mail,
      color: "bg-vector-orange hover:bg-vector-orange/90",
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${baseUrl}`,
      bgLight: "bg-orange-50"
    }
  ];

  return (
    <div className="w-full space-y-4">
      {/* Main Share Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3"
      >
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Share2 className="w-4 h-4 text-vector-blue" />
          Compartilhe Sua Conquista
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {shareLinks.map((link, index) => {
            const Icon = link.icon;
            const isShared = shared === link.platform;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => handleShare(link.platform, link.url)}
                  className={`w-full p-4 rounded-lg transition-all flex flex-col items-center gap-2 ${
                    isShared
                      ? "bg-green-100 border border-green-300"
                      : `${link.bgLight} border border-border hover:border-foreground/20`
                  }`}
                >
                  {isShared ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-6 h-6 text-green-600" />
                    </motion.div>
                  ) : (
                    <Icon className={`w-6 h-6 text-foreground`} />
                  )}
                  <span className="text-xs font-semibold text-foreground">
                    {isShared ? "Compartilhado!" : link.label}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Share Message Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-muted/50 rounded-lg border border-border"
      >
        <p className="text-xs text-muted-foreground mb-2">Mensagem de Compartilhamento:</p>
        <p className="text-sm font-semibold text-foreground mb-1">{content.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{content.description}</p>
      </motion.div>

      {/* Share Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-2xl font-black text-vector-blue">1.2K</p>
          <p className="text-xs text-muted-foreground">Compartilhamentos</p>
        </div>
        <div className="p-3 bg-teal-50 rounded-lg text-center">
          <p className="text-2xl font-black text-vector-teal">842</p>
          <p className="text-xs text-muted-foreground">Reações</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg text-center">
          <p className="text-2xl font-black text-vector-orange">456</p>
          <p className="text-xs text-muted-foreground">Comentários</p>
        </div>
      </motion.div>

      {/* Copy Link Option */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <p className="text-xs text-muted-foreground">Ou copie o link direto:</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={baseUrl}
            readOnly
            className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-xs font-mono"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(baseUrl);
              setShared("link");
              setTimeout(() => setShared(null), 2000);
            }}
            className="h-10"
          >
            {shared === "link" ? (
              <Check className="w-4 h-4" />
            ) : (
              "Copiar"
            )}
          </Button>
        </div>
      </motion.div>

      {/* Motivation Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 bg-vector-teal/10 border border-vector-teal/30 rounded-lg"
      >
        <p className="text-sm">
          <span className="font-bold text-vector-teal">🎉 Inspire Outros!</span>
          <br />
          Compartilhe sua jornada de aprendizado. Você pode motivar colegas a também dominarem vetores!
        </p>
      </motion.div>
    </div>
  );
}
