<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "form">
        <div class="choose_idp_container">
            <div id="kc-form" class="row">
                <div class="col-xs-12 col-sm-6 cell">
                    <div class="jumbotron h-100">
                        <h2>For deg som har lesetilgang</h2>
                        <#assign p = social.providers[0]>
                        <a href="${p.loginUrl}"
                           class="choose_idp_button">
                            <span>Logg inn som lesebruker</span></a>
                        <p>Med lesetilgang kan du se all informasjon din virksomhet har registret i katalogene sine.</p>
                        <div>
                            <p>
                                <strong>Trenger du lesetilgang?</strong><br>
                                Klikk <strong>Logg inn som lesebruker</strong>,
                                deretter <strong>Registrer bruker</strong>.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-6 cell">
                    <div class="jumbotron h-100">
                        <h2>For deg som har skrivetilgang</h2>
                        <#assign p = social.providers[1]>
                        <a href="${p.loginUrl}"
                           class="choose_idp_button">
                            <span>Logg inn med ID-porten</span></a>
                        <p>For å få tilgang til funksjonalitet som registrering og redigering på vegne av din
                            virksomhet, må du logge inn med IP porten.</p>
                        <div>
                            <p>
                                <strong>Trenger du skrivetilgang?</strong><br>
                                <a href="https://fellesdatakatalog.brreg.no/about-registration">
                                    Les hvordan du får tilgang til å registrere og redigere innhold.
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style="margin:3rem">
                <p>
                    <strong>Skal du gi andre skrivetilgang?</strong><br>
                    Du kan gi andre tilgang til å redigere datasettbeskrivelser, API-beskrivelser og begreper for din
                    virksomhet via Altinn.
                    <br />
                    Les mer om
                    <a href="https://fellesdatakatalog.brreg.no/about-registration">
                        hvordan du gir andre tilgang.
                    </a>
                </p>
            </div>
        </div>
    </#if>
</@layout.registrationLayout>
