package kr.co.ucp.dan.monitor.util;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.*;

public class ImageDumpServlet extends HttpServlet
{

    private static final long serialVersionUID = 1L;

    /**
     * @param request
     * @param name
     * @return
     * @throws javax.servlet.ServletException
     */
    public static String getParam( HttpServletRequest request, String name ) throws ServletException
    {
        @SuppressWarnings("unchecked")
		Map<String, String> map = (Map<String, String>)request.getAttribute( "Map" );
        if( map==null )
        {
            map = new HashMap<String, String>();

            Enumeration<?> e = request.getParameterNames();
            String key = new String();
            String value = new String();
            boolean blnE = e.hasMoreElements();
            while( blnE )
            {
                key = (String)e.nextElement();
                value = request.getParameter( key );
                try
                {
                    value = new String( value.getBytes( "8859_1" ), "UTF-8" );
                }
                catch( Exception ex )
                {
                    throw new ServletException( "Servlet error at getParam():"+ex.getMessage() );
                }
                map.put( key.toUpperCase(), value );
                blnE = e.hasMoreElements();
            }
            request.setAttribute( "Map", map );
        }
        return (String)map.get( name.toUpperCase() );
    }

    /**
     * @param request
     * @param response
     * @throws javax.servlet.ServletException
     * @throws java.io.IOException
     * @see javax.servlet.http.HttpServlet#service(javax.servlet.http.HttpServletRequest,
     *      javax.servlet.http.HttpServletResponse)
     */
    protected void service( HttpServletRequest request, HttpServletResponse response ) throws ServletException,
            IOException
    {
        String urlParam = getParam( request, "URL" );
        if( urlParam==null||urlParam.trim().length()==0 )
        {
            response.sendError( HttpServletResponse.SC_BAD_REQUEST );
            return;
        }

        boolean doPost = request.getMethod().equalsIgnoreCase( "POST" );
        URL url = new URL( urlParam );
        HttpURLConnection http = (HttpURLConnection)url.openConnection();
        Enumeration<?> headerNames = request.getHeaderNames();
        String key = new String();
        boolean blnHeaderNames = headerNames.hasMoreElements();
        while( blnHeaderNames )
        {
            key = (String)headerNames.nextElement();
            if( !key.equalsIgnoreCase( "Host" ) )
            {
                http.setRequestProperty( key, request.getHeader( key ) );
            }
            blnHeaderNames = headerNames.hasMoreElements();
        }

        byte[] buffer = null;
        int read = -1;

        if( "application/x-www-form-urlencoded".equalsIgnoreCase( request.getContentType() ) )
        {
            http.setDoInput( true );
            http.setDoOutput( true );

            Enumeration<?> names = request.getParameterNames();
            boolean firstParam = urlParam.indexOf( "?" )<=-1;
            StringBuffer sb = new StringBuffer();
            String name = new String();
            boolean blnNames = names.hasMoreElements();
            while( blnNames )
            {
                name = (String)names.nextElement();
                if( firstParam )
                {
                    sb.append( "?" );
                    firstParam = false;
                }
                else
                {
                    sb.append( "&" );
                }
                sb.append( name ).append( "=" );
                sb.append( URLEncoder.encode( request.getParameter( name ), "UTF-8" ) );
                blnNames = names.hasMoreElements();
            }
            OutputStream os = http.getOutputStream();
            buffer = sb.toString().getBytes();
            os.write( buffer, 0, buffer.length );
            os.close();
        }
        else
        {
            http.setDoInput( true );
            http.setDoOutput( doPost );

            buffer = new byte[8192];
            read = -1;

            if( doPost )
            {
                OutputStream os = http.getOutputStream();
                ServletInputStream sis = request.getInputStream();
                read = sis.read( buffer );
                while( read!=-1 )
                {
                    os.write( buffer, 0, read );
                    read = sis.read( buffer );
                }
                os.close();
            }
        }

        InputStream is = http.getInputStream();
        response.setStatus( http.getResponseCode() );
        Map<?, ?> headerKeys = http.getHeaderFields();
        Set<?> keySet = headerKeys.keySet();
        Iterator<?> iter = keySet.iterator();
        String value = new String();
        boolean blnIter = iter.hasNext();
        while( blnIter )
        {
            key = (String)iter.next();
            value = http.getHeaderField( key );
            if( key!=null&&value!=null )
            {
                response.setHeader( key, value );
            }
            blnIter = iter.hasNext();
        }
        // Image Dump Header Hard Coding
        response.setHeader( "Content-Disposition", "attachment;filename=doanMap.png;" );
        ServletOutputStream sos = response.getOutputStream();
        response.resetBuffer();
        read = is.read( buffer );
        while( read!=-1 )
        {
            sos.write( buffer, 0, read );
            read = is.read( buffer );
        }
        response.flushBuffer();
        sos.close();
    }
}
