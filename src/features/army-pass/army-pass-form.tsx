import { biases, brazilianStates, experienceOptions } from "./themes";
import type { PassFields } from "./types";
import styles from "./army-pass.module.css";

export type FieldErrors = Partial<Record<keyof PassFields, string>>;
export function ArmyPassForm({
  fields,
  onChange,
  errors,
}: {
  fields: PassFields;
  onChange: (fields: PassFields) => void;
  errors: FieldErrors;
}) {
  const update = (key: keyof PassFields, value: string) =>
    onChange({ ...fields, [key]: value });
  const help = (key: keyof PassFields) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `error-${key}` : undefined,
  });
  const error = (key: keyof PassFields) =>
    errors[key] && (
      <span className={styles.fieldError} id={`error-${key}`}>
        {errors[key]}
      </span>
    );
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Sua história, do seu jeito.</legend>
      <p className={styles.hint}>
        Só o nome ou apelido é obrigatório. Os outros detalhes ficam por sua
        conta.
      </p>
      <div className={styles.formGrid}>
        <label className={styles.wide}>
          <span className={styles.fieldLabel}>
            Nome ou apelido <span aria-hidden="true">*</span>
          </span>
          <input
            id="pass-displayName"
            name="displayName"
            autoComplete="off"
            value={fields.displayName}
            onChange={(e) => update("displayName", e.target.value)}
            maxLength={30}
            required
            {...help("displayName")}
            placeholder="Como você quer aparecer no seu pass?"
          />
          {error("displayName")}
          <span className={styles.counter}>{fields.displayName.length}/30</span>
        </label>
        <label>
          <span className={styles.fieldLabel}>
            Cidade <span className={styles.optional}>(opcional)</span>
          </span>
          <input
            value={fields.city}
            onChange={(e) => update("city", e.target.value)}
            maxLength={60}
            autoComplete="off"
            {...help("city")}
          />
          {error("city")}
        </label>
        <label>
          <span className={styles.fieldLabel}>
            Estado <span className={styles.optional}>(opcional)</span>
          </span>
          <select
            value={fields.state}
            onChange={(e) => update("state", e.target.value)}
            {...help("state")}
          >
            <option value="">Não informar</option>
            {brazilianStates.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </select>
          {error("state")}
        </label>
        <label>
          <span className={styles.fieldLabel}>Bias favorito</span>
          <select
            value={fields.bias}
            onChange={(e) => update("bias", e.target.value)}
            {...help("bias")}
          >
            {biases.map((bias) => (
              <option key={bias}>{bias}</option>
            ))}
          </select>
          {error("bias")}
        </label>
        <label>
          <span className={styles.fieldLabel}>
            ARMY desde <span className={styles.optional}>(opcional)</span>
          </span>
          <input
            inputMode="numeric"
            value={fields.armySince}
            onChange={(e) => update("armySince", e.target.value)}
            maxLength={4}
            placeholder="Ex.: 2018"
            {...help("armySince")}
          />
          {error("armySince")}
        </label>
        <label className={styles.wide}>
          <span className={styles.fieldLabel}>
            Música favorita <span className={styles.optional}>(opcional)</span>
          </span>
          <input
            value={fields.favoriteSong}
            onChange={(e) => update("favoriteSong", e.target.value)}
            maxLength={80}
            {...help("favoriteSong")}
          />
          {error("favoriteSong")}
          <span className={styles.counter}>
            {fields.favoriteSong.length}/80
          </span>
        </label>
        <label className={styles.wide}>
          <span className={styles.fieldLabel}>Minha experiência</span>
          <select
            value={fields.experience}
            onChange={(e) => update("experience", e.target.value)}
            {...help("experience")}
          >
            {experienceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          {error("experience")}
        </label>
        <label className={styles.wide}>
          <span className={styles.fieldLabel}>
            Mensagem especial{" "}
            <span className={styles.optional}>(opcional)</span>
          </span>
          <textarea
            rows={3}
            value={fields.message}
            onChange={(e) => update("message", e.target.value)}
            maxLength={140}
            {...help("message")}
            placeholder="Uma lembrança, um sentimento, uma conexão…"
          />
          {error("message")}
          <span className={styles.counter}>{fields.message.length}/140</span>
        </label>
      </div>
    </fieldset>
  );
}
