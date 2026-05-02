import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Copy, Award } from "lucide-react";
import { useState } from "react";

export interface CertificateData {
  studentName: string;
  completionDate: string;
  certificateId: string;
  courseName: string;
  level: "iniciante" | "intermediario" | "avancado" | "mestre";
  hoursSpent: number;
  certificateUrl?: string;
}

interface CertificateProps {
  certificate: CertificateData;
  onDownload?: () => void;
  onShare?: () => void;
}

export function Certificate({ certificate, onDownload, onShare }: CertificateProps) {
  const [copied, setCopied] = useState(false);

  const levelColors = {
    iniciante: "from-blue-500 to-vector-blue",
    intermediario: "from-vector-teal to-teal-500",
    avancado: "from-vector-orange to-orange-500",
    mestre: "from-purple-500 to-pink-500"
  };

  const levelLabels = {
    iniciante: "Iniciante",
    intermediario: "Intermediário",
    avancado: "Avançado",
    mestre: "Mestre"
  };

  const handleCopyUrl = () => {
    const url = certificate.certificateUrl || window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Certificate Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="perspective"
      >
        <Card className={`relative overflow-hidden border-2 bg-gradient-to-br ${levelColors[certificate.level]}/10`}>
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-vector-blue rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-vector-teal rounded-full blur-3xl" />
          </div>

          <CardContent className="relative p-12 text-center min-h-96 flex flex-col justify-between">
            {/* Header with Icon */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Award className={`w-16 h-16 text-${certificate.level === "mestre" ? "purple" : certificate.level === "avancado" ? "vector-orange" : certificate.level === "intermediario" ? "vector-teal" : "vector-blue"}-600`} />
              </motion.div>

              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-vector-blue to-vector-teal">
                Certificado de Conclusão
              </h1>
            </motion.div>

            {/* Certificate Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6 my-8"
            >
              <div>
                <p className="text-sm text-muted-foreground mb-1">Certificamos que</p>
                <p className="text-3xl font-black text-foreground">{certificate.studentName}</p>
              </div>

              <div className="border-t border-b border-border py-6 px-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">completou com sucesso</p>
                <p className="text-2xl font-bold text-vector-blue mb-1">{certificate.courseName}</p>
                <p className={`text-lg font-bold bg-gradient-to-r ${levelColors[certificate.level]} bg-clip-text text-transparent`}>
                  Nível: {levelLabels[certificate.level]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Horas Estudadas</p>
                  <p className="text-xl font-bold text-vector-teal">{certificate.hoursSpent}h</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data de Conclusão</p>
                  <p className="text-xl font-bold text-vector-orange">
                    {new Date(certificate.completionDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">ID do Certificado</p>
                <p className="font-mono text-xs font-bold text-muted-foreground break-all">
                  {certificate.certificateId}
                </p>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-muted-foreground"
            >
              <p>Emitido por Mind Vectors • Certificação Profissional em Vetores</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 flex-wrap justify-center"
      >
        <Button
          onClick={onDownload}
          className="gap-2 bg-vector-blue hover:bg-vector-blue/90"
        >
          <Download className="w-4 h-4" />
          Baixar PDF
        </Button>

        <Button
          onClick={handleCopyUrl}
          variant="outline"
          className="gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied ? "Copiado!" : "Copiar Link"}
        </Button>

        <Button
          onClick={onShare}
          variant="outline"
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </motion.div>

      {/* Share Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 bg-muted/50 rounded-lg border border-border"
      >
        <h4 className="font-bold text-sm mb-3">Compartilhe seu Sucesso</h4>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            ✨ Parabéns! Você completou {certificate.courseName} em nível {levelLabels[certificate.level]}!
          </p>
          <p className="text-xs text-muted-foreground">
            Pressione "Compartilhar" para postar em suas redes sociais!
          </p>
        </div>
      </motion.div>

      {/* Similar Certificates Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-4 bg-vector-teal/10 border border-vector-teal/30 rounded-lg"
      >
        <p className="text-sm">
          <span className="font-bold text-vector-teal">🎯 Próximo Passo:</span>
          <br />
          Desafie-se com nosso próximo módulo avançado ou ajude outros alunos como mentor!
        </p>
      </motion.div>
    </div>
  );
}
