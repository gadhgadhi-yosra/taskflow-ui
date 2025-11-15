import { Facebook } from "lucide-react";
import { AuthButton } from "./AuthButton";

export function SocialButtons({ onClick, loading }) {
  return (
    <div className="space-y-3">
      <AuthButton
        type="button"
        variant="social"
        onClick={onClick}
        disabled={loading}
      >
        <Facebook
          size={18}
          className="text-blue-600 transition-transform group-hover:scale-110"
        />
        <span>Continuer avec Facebook</span>
      </AuthButton>

      <AuthButton
        type="button"
        variant="social"
        onClick={onClick}
        disabled={loading}
      >
        <div className="w-5 h-5 bg-white border border-slate-300 rounded flex items-center justify-center text-red-500 text-sm font-bold transition-transform group-hover:scale-110">
          G
        </div>
        <span>Continuer avec Google</span>
      </AuthButton>
    </div>
  );
}
