#include <napi.h>

namespace moveCursor {
  int exec(int x, int y);
  Napi::Number MoveCursorWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
}
