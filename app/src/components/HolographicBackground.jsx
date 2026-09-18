import React, { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_active;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / max(u_res.y, 1.0);

  vec3 base = mix(vec3(1.0, 1.0, 1.0), vec3(0.953, 0.957, 0.965), uv.y);
  float wash = noise(uv * 3.2 + u_time * 0.03);
  base = mix(base, vec3(0.98, 0.96, 1.0), wash * 0.18);

  vec2 m = u_mouse;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 mp = vec2(m.x * aspect, m.y);
  float d1 = length(p - mp);
  float d2 = length(p - mp + vec2(0.08, -0.04));
  float glow1 = exp(-d1 * 3.4) * 0.72 * u_active;
  float glow2 = exp(-d2 * 4.6) * 0.42 * u_active;
  vec3 violet = vec3(0.545, 0.361, 0.965);
  vec3 magenta = vec3(0.753, 0.518, 0.988);
  vec3 color = base + violet * glow1 + magenta * glow2;

  float angle = radians(33.0);
  vec2 dir = vec2(cos(angle), sin(angle));
  float freq = 7.4;
  float ridge = dot(vec2(uv.x * aspect, uv.y), dir) * freq;
  float flute = fract(ridge);
  float wave = 0.5 - 0.5 * cos(flute * 6.283185);
  float edge = smoothstep(0.0, 0.12, flute) * smoothstep(1.0, 0.88, flute);
  float slope = sin(flute * 6.283185);

  vec2 refractUV = uv + dir * slope * 0.012;
  float nShift = noise(refractUV * 8.0 + u_time * 0.05) * 0.04;
  color = mix(color, color * vec3(0.97, 0.96, 1.02), nShift);

  float aberr = 0.007 * (1.0 - edge);
  color.r += 0.18 * aberr * slope;
  color.b -= 0.16 * aberr * slope;
  color.g += 0.04 * aberr;

  float highlight = pow(wave, 8.0) * 0.22;
  color += vec3(1.0) * highlight;
  color = mix(color, vec3(0.94, 0.93, 0.97), (1.0 - wave) * 0.10);

  float grain = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.035;
  color += grain;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(info || 'Shader compile failed');
  }
  return shader;
}

function createProgram(gl) {
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Program link failed');
  }
  return program;
}

export function HolographicBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return undefined;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) return undefined;

    let program;
    try {
      program = createProgram(gl);
    } catch (err) {
      console.warn('[HolographicBackground]', err);
      return undefined;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_pos');
    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uActive = gl.getUniformLocation(program, 'u_active');

    gl.useProgram(program);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const mouse = { x: 0.62, y: 0.38, tx: 0.62, ty: 0.38, active: 0, tActive: 0 };
    let raf = 0;
    let running = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (now) => {
      if (!running) return;
      resize();
      mouse.x += (mouse.tx - mouse.x) * 0.085;
      mouse.y += (mouse.ty - mouse.y) * 0.085;
      mouse.active += (mouse.tActive - mouse.active) * 0.06;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, 1.0 - mouse.y);
      gl.uniform1f(uActive, mouse.active);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      mouse.ty = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      mouse.tActive = 1;
    };
    const onLeave = () => {
      mouse.tActive = 0;
    };

    const parent = canvas.parentElement;
    const target = parent?.parentElement || parent || canvas;
    target.addEventListener('mousemove', onMove);
    target.addEventListener('mouseleave', onLeave);

    const vis = () => {
      running = !document.hidden && canvas.clientWidth > 0;
      if (running && raf === 0) raf = requestAnimationFrame(draw);
      if (!running && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    document.addEventListener('visibilitychange', vis);

    const io = new IntersectionObserver(
      ([entry]) => {
        running = !!entry?.isIntersecting && !document.hidden;
        if (running && raf === 0) raf = requestAnimationFrame(draw);
        if (!running && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', vis);
      target.removeEventListener('mousemove', onMove);
      target.removeEventListener('mouseleave', onLeave);
      io.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 -z-10 h-full w-full overflow-hidden pointer-events-auto ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export default HolographicBackground;
