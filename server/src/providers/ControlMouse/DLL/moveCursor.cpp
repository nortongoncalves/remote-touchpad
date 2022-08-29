#include "moveCursor.h"
#include <X11/Xlib.h>
#include <X11/Xutil.h>


int moveCursor::exec(int x, int y) {
  Display *displayMain = XOpenDisplay(NULL);

  if(displayMain == NULL) {
      fprintf(stderr, "Errore nell'apertura del Display !!!\n");
      exit(EXIT_FAILURE);
  }

  XWarpPointer(displayMain, None, None, 0, 0, 0, 0, x, y);

  XCloseDisplay(displayMain);
  return 0;
}

Napi::Number moveCursor::MoveCursorWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }

  int x = info[0].ToNumber().Int32Value();
  int y = info[1].ToNumber().Int32Value();

  int returnValue = moveCursor::exec(x, y);

  return Napi::Number::New(env, returnValue);
}

Napi::Object moveCursor::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("moveCursor", Napi::Function::New(env, moveCursor::MoveCursorWrapped));
  return exports;
}
