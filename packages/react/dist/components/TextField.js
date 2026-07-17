import { jsx } from 'react/jsx-runtime';
import { forwardRef } from 'react';
import { TextInput } from './TextInput.js';

const TextField = forwardRef(
  function TextField2(props, ref) {
    return /* @__PURE__ */ jsx(TextInput, { ref, ...props });
  }
);

export { TextField };
//# sourceMappingURL=TextField.js.map
//# sourceMappingURL=TextField.js.map