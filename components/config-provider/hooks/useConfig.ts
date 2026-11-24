import { useInjectDisabled } from '../DisabledContext';
import { useInjectSize } from '../SizeContext';

function useConfig() {
  const componentDisabled = useInjectDisabled();
  const componentSize = useInjectSize();

  return {
    componentDisabled,
    componentSize,
  };
}

export default useConfig;
