{
  "targets": [
    {
      "target_name": "ControlMouseAddon",
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "sources": [
        "./src/providers/ControlMouse/DLL/main.cpp",
        "./src/providers/ControlMouse/DLL/moveCursor.cpp",
      ],
      "include_dirs": ["<!(node -p \"require('node-addon-api').include_dir\")"],
      "libraries": [],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": ['NAPI_DISABLE_CPP_EXCEPTIONS'],
    }
  ]
}
