package com.enonic.app.proxydebug;

import org.junit.jupiter.api.Test;

import com.enonic.xp.testing.ScriptTestSupport;

public class ProxyDebugTest
    extends ScriptTestSupport
{
    @Test
    public void returnHtmlTrueWhenAcceptHasTextHtml()
    {
        runFunction( "/lib/util-test.js", "returnHtmlTrueWhenAcceptHasTextHtml" );
    }

    @Test
    public void returnHtmlFalseWhenAcceptLacksTextHtml()
    {
        runFunction( "/lib/util-test.js", "returnHtmlFalseWhenAcceptLacksTextHtml" );
    }

    @Test
    public void stallSleepsForParsedMillis()
    {
        runFunction( "/lib/proxy-test.js", "stallSleepsForParsedMillis" );
    }

    @Test
    public void noStallDoesNotSleep()
    {
        runFunction( "/lib/proxy-test.js", "noStallDoesNotSleep" );
    }

    @Test
    public void ackHeartbeatFlagFromParam()
    {
        runFunction( "/lib/proxy-test.js", "ackHeartbeatFlagFromParam" );
    }

    @Test
    public void echoesRegularMessage()
    {
        runFunction( "/lib/proxy-test.js", "echoesRegularMessage" );
    }

    @Test
    public void acksHeartbeatWhenEnabled()
    {
        runFunction( "/lib/proxy-test.js", "acksHeartbeatWhenEnabled" );
    }

    @Test
    public void ignoresHeartbeatWhenAckDisabled()
    {
        runFunction( "/lib/proxy-test.js", "ignoresHeartbeatWhenAckDisabled" );
    }
}
