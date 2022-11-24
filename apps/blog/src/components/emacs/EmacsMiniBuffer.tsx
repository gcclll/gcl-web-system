import { useStore } from '../../store';

type EmacsMiniBufferProps = {
  className?: string;
};

const EmacsMiniBuffer: React.FC<EmacsMiniBufferProps> = () => {
  const { state } = useStore();
  const miniBuffer = state.emacs.miniBuffer

  return (
    <div className="flex pt-1 h-8">
      <div className="w-1/2 h-full">{miniBuffer.left}</div>
      <div className="pr-4 w-1/2 h-full text-right">{miniBuffer.right}</div>
    </div>
  );
};

export default EmacsMiniBuffer;
