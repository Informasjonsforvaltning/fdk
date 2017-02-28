<?xml version="1.0" ?>
<xsl:stylesheet 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:exsl="http://exslt.org/common" 
exclude-result-prefixes="exsl"
version="1.0" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" 
xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
>

  
    <xsl:output method="xml" indent="yes"/>
    <xsl:template match="/">
        <office:spreadsheet>
        <xsl:apply-templates select="//table:table"/>   
        </office:spreadsheet> 
    </xsl:template>
    
    
    <xsl:template match="table:table">    
      <table:table>    
        <xsl:attribute name="table:name"><xsl:value-of select="@table:name"/></xsl:attribute>
        <xsl:apply-templates select="table:table-row"/>
       </table:table>
    </xsl:template>
    
    <xsl:template match="table:table-row">
        <table:table-row>
        <xsl:for-each select="table:table-cell">    
            <xsl:choose>
                <xsl:when test="@table:number-columns-repeated">
                    
                        <xsl:call-template name="write-copies-of-cell">
                            <xsl:with-param name="count" select="number(@table:number-columns-repeated)"/>
                            <xsl:with-param name="node"><xsl:element name="table:table-cell"><xsl:copy-of select="@*|node()"/></xsl:element></xsl:with-param>
                        </xsl:call-template>
            
                    
                    

                    </xsl:when>
                <xsl:otherwise>
                   <table:table-cell>
                        <xsl:value-of select="./*"/>
                    </table:table-cell>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
        </table:table-row>
    </xsl:template>
    
    
   <xsl:template name="write-copies-of-cell">
   <xsl:param name="count" />
   <xsl:param name="node" />
   <xsl:copy-of select="$node"/>
   <xsl:choose>
     <xsl:when test="$count > 1">
       <xsl:comment select="$count"/>
       <xsl:value-of select="$node"/> 
       <xsl:call-template name="write-copies-of-cell">
         <xsl:with-param name="count" select="$count - 1"/>
         <xsl:with-param name="node" select="$node"/>
       </xsl:call-template>
     </xsl:when>
     <xsl:otherwise/>
   </xsl:choose>
</xsl:template>
    
    
</xsl:stylesheet>