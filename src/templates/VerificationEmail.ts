export function verificationEmailTemplate(
  code: string,
  expiresAt: string,
) {
  const expiration = new Date(expiresAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #F5EFFF;
  font-family: Inter, Arial, Helvetica, sans-serif;
  color: #16262E;
">

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background-color: #F5EFFF;
      padding: 40px 16px;
    "
  >
    <tr>
      <td align="center">

        <!-- Main card -->
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 520px;
            background-color: #FFFFFF;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #D0CCD0;
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                padding: 28px 24px;
                background-color: #16262E;
              "
            >
              <div style="
                font-family: Manrope, Arial, Helvetica, sans-serif;
                font-size: 24px;
                font-weight: 800;
                letter-spacing: -0.5px;
                color: #FFFFFF;
              ">
                NovaMarket
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="
              padding: 40px 32px;
            ">

              <h1 style="
                margin: 0 0 12px;
                font-family: Manrope, Arial, Helvetica, sans-serif;
                font-size: 26px;
                line-height: 34px;
                font-weight: 800;
                text-align: center;
                color: #16262E;
              ">
                Verify your email
              </h1>

              <p style="
                margin: 0 auto 30px;
                max-width: 400px;
                font-size: 15px;
                line-height: 24px;
                text-align: center;
                color: #5d6d75;
              ">
                Enter the verification code below to confirm
                your email address and continue with NovaMarket.
              </p>

              <!-- Code -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td align="center">

                    <div style="
                      display: inline-block;
                      padding: 16px 28px;
                      background-color: #F5EFFF;
                      border: 1px solid #D0CCD0;
                      border-radius: 10px;
                      font-family: Manrope, Arial, Helvetica, sans-serif;
                      font-size: 32px;
                      line-height: 40px;
                      font-weight: 800;
                      letter-spacing: 8px;
                      color: #0077B6;
                    ">
                      ${code}
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Expiration -->
              <p style="
                margin: 24px 0 0;
                font-size: 14px;
                line-height: 22px;
                text-align: center;
                color: #5d6d75;
              ">
                This code expires at
                <strong style="color: #16262E;">
                  ${expiration}
                </strong>.
              </p>

              <!-- Security notice -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top: 28px;
                "
              >
                <tr>
                  <td style="
                    padding: 14px 16px;
                    background-color: #EBE8F0;
                    border-left: 4px solid #5ABCB9;
                    border-radius: 6px;
                  ">
                    <p style="
                      margin: 0;
                      font-size: 13px;
                      line-height: 20px;
                      color: #5d6d75;
                    ">
                      If you didn't request this verification code,
                      you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Signature -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top: 36px;
                "
              >
                <tr>
                  <td align="center">

                    <img
                      src="cid:NovaSign"
                      alt="NovaMarket"
                      width="48"
                      height="48"
                      style="
                        display: block;
                        margin: 0 auto 10px;
                        border-radius: 10px;
                      "
                    />

                    <p style="
                      margin: 0;
                      font-family: Manrope, Arial, Helvetica, sans-serif;
                      font-size: 14px;
                      font-weight: 700;
                      color: #16262E;
                    ">
                      NovaMarket
                    </p>

                    <p style="
                      margin: 4px 0 0;
                      font-size: 12px;
                      color: #8A969C;
                    ">
                      The NovaMarket Team
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              padding: 24px;
              background-color: #16262E;
            ">

              <p style="
                margin: 0;
                text-align: center;
                font-size: 12px;
                line-height: 18px;
                color: #8da8b5;
              ">
                © ${year} NovaMarket. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}
