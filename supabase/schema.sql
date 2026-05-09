-- =====================================================
-- 不動産管理アプリ Supabase スキーマ定義
-- =====================================================
-- 実行手順:
--   Supabase ダッシュボード > SQL Editor > 以下を貼り付けて実行
-- =====================================================


-- =====================================================
-- 物件テーブル
-- =====================================================
CREATE TABLE IF NOT EXISTS properties (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,          -- 物件名
  rent       INTEGER     NOT NULL CHECK (rent >= 0),  -- 家賃（円）
  area       TEXT        NOT NULL,          -- エリア名
  layout     TEXT        NOT NULL,          -- 間取り（例: 1LDK）
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 作成日時の降順インデックス（一覧取得を高速化）
CREATE INDEX IF NOT EXISTS properties_user_id_created_at_idx
  ON properties (user_id, created_at DESC);


-- =====================================================
-- Row Level Security（RLS）設定
-- =====================================================
-- RLSを有効化：全行へのデフォルトアクセスを拒否する
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 既存ポリシーをリセット（再実行時のエラー防止）
DROP POLICY IF EXISTS "自分の物件のみ取得可能"   ON properties;
DROP POLICY IF EXISTS "自分の物件のみ登録可能"   ON properties;
DROP POLICY IF EXISTS "自分の物件のみ更新可能"   ON properties;
DROP POLICY IF EXISTS "自分の物件のみ削除可能"   ON properties;

-- SELECT: ログインユーザー自身が登録した物件のみ取得できる
CREATE POLICY "自分の物件のみ取得可能"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: user_id がログインユーザーのものだけ挿入できる
CREATE POLICY "自分の物件のみ登録可能"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 自分が登録した物件のみ更新できる
CREATE POLICY "自分の物件のみ更新可能"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 自分が登録した物件のみ削除できる
CREATE POLICY "自分の物件のみ削除可能"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);
